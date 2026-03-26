import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type Timeslot = {
  id: string;
  date: string;
  time: string;
  booked: boolean;
};

const TIMESLOTS_PATH = path.join(process.cwd(), "data", "timeslots.json");

async function readTimeslots(): Promise<Timeslot[]> {
  const raw = await fs.readFile(TIMESLOTS_PATH, "utf8");
  return JSON.parse(raw) as Timeslot[];
}

async function writeTimeslots(timeslots: Timeslot[]): Promise<void> {
  await fs.writeFile(TIMESLOTS_PATH, JSON.stringify(timeslots, null, 2), "utf8");
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
  const timeslots = await readTimeslots();
  const available = timeslots.filter((slot) => !slot.booked);
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

  const timeslots = await readTimeslots();
  const slotIndex = timeslots.findIndex((slot) => slot.id === body.slotId);

  if (slotIndex === -1) {
    return NextResponse.json({ message: "Tiden hittades inte." }, { status: 404 });
  }

  if (timeslots[slotIndex].booked) {
    return NextResponse.json(
      { message: "Tiden ar redan bokad, valj en annan tid." },
      { status: 409 },
    );
  }

  timeslots[slotIndex].booked = true;
  await writeTimeslots(timeslots);

  const slot = timeslots[slotIndex];
  const emailResult = await sendBookingEmail({
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    service: body.service,
    date: slot.date,
    time: slot.time,
    note: body.note,
  }).catch(() => ({ sent: false, reason: "send_failed" as const }));

  return NextResponse.json({
    message: "Bokningen ar mottagen.",
    emailSent: emailResult.sent,
  });
}
