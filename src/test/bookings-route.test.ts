import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/booking-email", () => ({
  sendBookingEmails: vi.fn().mockResolvedValue(undefined),
}));

import { sendBookingEmails } from "@/lib/booking-email";
import { POST } from "../../app/api/bookings/route";

function buildSlotId(date: Date, time: string): string {
  return `${date.toISOString().slice(0, 10)}-${time.replace(":", "")}`;
}

describe("POST /api/bookings", () => {
  beforeEach(() => {
    vi.mocked(sendBookingEmails).mockClear();
  });

  it("normalizes the submitted customer email before sending emails", async () => {
    const response = await POST(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: " Alice ",
          customerEmail: " Customer@Example.com ",
          customerPhone: " 0701234567 ",
          service: " Herrklippning ",
          slotId: buildSlotId(new Date(), "09:30"),
          note: " Test ",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(sendBookingEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Alice",
        customerEmail: "customer@example.com",
        customerPhone: "0701234567",
        service: "Herrklippning",
        note: "Test",
      }),
    );
  });

  it("rejects invalid customer email addresses", async () => {
    const response = await POST(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Alice",
          customerEmail: "not-an-email",
          customerPhone: "0701234567",
          service: "Herrklippning",
          slotId: buildSlotId(new Date(), "09:30"),
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(sendBookingEmails).not.toHaveBeenCalled();
  });
});
