import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type BookingRecord = {
  id: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  note?: string;
  date: string;
  time: string;
  createdAt: string;
};

const TIMESLOTS_PATH = path.join(process.cwd(), "data", "timeslots.json");
const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

type Slot = {
  id: string;
  date: string;
  time: string;
};

function toDateKey(input: Date): string {
  return input.toISOString().slice(0, 10);
}

function createSlotId(date: string, time: string): string {
  return `${date}-${time.replace(":", "")}`;
}

async function readDailyTimes(): Promise<string[]> {
  const raw = await fs.readFile(TIMESLOTS_PATH, "utf8");
  return JSON.parse(raw) as string[];
}

async function readBookings(): Promise<BookingRecord[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf8");
    return JSON.parse(raw) as BookingRecord[];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: BookingRecord[]): Promise<void> {
  await fs.writeFile(BOOKINGS_PATH, JSON.stringify(bookings, null, 2), "utf8");
}

function buildUpcomingWeekSlots(dailyTimes: string[]): Slot[] {
  const today = new Date();
  const slots: Slot[] = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateKey = toDateKey(date);

    for (const time of dailyTimes) {
      slots.push({
        id: createSlotId(dateKey, time),
        date: dateKey,
        time,
      });
    }
  }

  return slots;
}

async function sendBookingEmail(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  note?: string;
}) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    BOOKING_NOTIFY_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return { sent: false, reason: "missing_smtp_config" as const };
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const to = BOOKING_NOTIFY_EMAIL || SMTP_USER;

  await transport.sendMail({
    from: `"S Barbershop Bokning" <${SMTP_USER}>`,
    to,
    subject: `Ny bokning: ${input.service} ${input.date} ${input.time}`,
    text: [
      "Ny bokning inkom:",
      `Namn: ${input.customerName}`,
      `E-post: ${input.customerEmail}`,
      `Telefon: ${input.customerPhone}`,
      `Tjanst: ${input.service}`,
      `Tid: ${input.date} ${input.time}`,
      `Meddelande: ${input.note || "-"}`,
    ].join("\n"),
  });

  return { sent: true as const };
}

export async function GET() {
  const dailyTimes = await readDailyTimes();
  const slots = buildUpcomingWeekSlots(dailyTimes);
  const bookings = await readBookings();
  const bookedIds = new Set(bookings.map((booking) => booking.slotId));
  const available = slots.filter((slot) => !bookedIds.has(slot.id));

  return NextResponse.json({ slots: available });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    service?: string;
    slotId?: string;
    note?: string;
  };

  if (
    !body.customerName ||
    !body.customerEmail ||
    !body.customerPhone ||
    !body.service ||
    !body.slotId
  ) {
    return NextResponse.json(
      { message: "Fyll i alla obligatoriska falt." },
      { status: 400 },
    );
  }

  const dailyTimes = await readDailyTimes();
  const slots = buildUpcomingWeekSlots(dailyTimes);
  const selectedSlot = slots.find((slot) => slot.id === body.slotId);
  if (!selectedSlot) {
    return NextResponse.json({ message: "Tiden hittades inte." }, { status: 404 });
  }

  const bookings = await readBookings();
  const alreadyBooked = bookings.some((booking) => booking.slotId === body.slotId);
  if (alreadyBooked) {
    return NextResponse.json(
      { message: "Tiden ar redan bokad, valj en annan tid." },
      { status: 409 },
    );
  }

  const bookingRecord: BookingRecord = {
    id: crypto.randomUUID(),
    slotId: body.slotId,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    service: body.service,
    note: body.note || "",
    date: selectedSlot.date,
    time: selectedSlot.time,
    createdAt: new Date().toISOString(),
  };
  bookings.push(bookingRecord);
  await writeBookings(bookings);

  const emailResult = await sendBookingEmail({
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    service: body.service,
    date: selectedSlot.date,
    time: selectedSlot.time,
    note: body.note,
  }).catch(() => ({ sent: false, reason: "send_failed" as const }));

  return NextResponse.json({
    message: "Bokningen ar mottagen.",
    emailSent: emailResult.sent,
  });
}
