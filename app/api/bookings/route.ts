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

function toDateKey(input: Date): string {
  return input.toISOString().slice(0, 10);
}

function createSlotId(date: string, time: string): string {
  return `${date}-${time.replace(":", "")}`;
}

function buildUpcomingWeekSlots(): Slot[] {
  const today = new Date();

  // Static times for now
  const dailyTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
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

    if (
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone ||
      !body.service ||
      !body.slotId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    const slots = buildUpcomingWeekSlots();

    const selectedSlot = slots.find(
      (slot) => slot.id === body.slotId
    );

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