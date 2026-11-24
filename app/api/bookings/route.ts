import { NextResponse } from "next/server";
import { sendBookingEmails } from "@/lib/booking-email";

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

type Slot = {
  id: string;
  date: string;
  time: string;
};

function normalizeField(value?: string): string {
  return value?.trim() ?? "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function toDateKey(input: Date): string {
  return input.toISOString().slice(0, 10);
}

function createSlotId(date: string, time: string): string {
  return `${date}-${time.replace(":", "")}`;
}

function buildUpcomingWeekSlots(): Slot[] {
  const today = new Date();

  // Static times for now (open until 19:00)
  const dailyTimes = [
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

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

export async function GET() {
  const slots = buildUpcomingWeekSlots();

  return NextResponse.json({
    slots,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      service?: string;
      slotId?: string;
      note?: string;
    };

    const customerName = normalizeField(body.customerName);
    const customerEmail = normalizeField(body.customerEmail).toLowerCase();
    const customerPhone = normalizeField(body.customerPhone);
    const service = normalizeField(body.service);
    const slotId = normalizeField(body.slotId);
    const note = normalizeField(body.note);

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !service ||
      !slotId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(customerEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const slots = buildUpcomingWeekSlots();

    const selectedSlot = slots.find((slot) => slot.id === slotId);

    if (!selectedSlot) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected time slot not found.",
        },
        { status: 404 }
      );
    }

    const bookingRecord: BookingRecord = {
      id: crypto.randomUUID(),
      slotId,
      customerName,
      customerEmail,
      customerPhone,
      service,
      note,
      date: selectedSlot.date,
      time: selectedSlot.time,
      createdAt: new Date().toISOString(),
    };

    await sendBookingEmails(bookingRecord);

    return NextResponse.json({
      success: true,
      message: "Booking email sent successfully.",
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process booking.",
      },
      { status: 500 }
    );
  }
}