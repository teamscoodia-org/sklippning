import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const sendMail = vi.fn().mockResolvedValue({});
  const createTransport = vi.fn(() => ({ sendMail }));

  return {
    sendMail,
    createTransport,
  };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

import { sendBookingEmails } from "@/lib/booking-email";

describe("sendBookingEmails", () => {
  beforeEach(() => {
    mocks.sendMail.mockClear();
    mocks.createTransport.mockClear();

    process.env.LOOPIA_SMTP_HOST = "mail.example.com";
    process.env.LOOPIA_SMTP_PORT = "587";
    process.env.LOOPIA_SMTP_SECURE = "false";
    process.env.LOOPIA_SMTP_USER = "shop@example.com";
    process.env.LOOPIA_SMTP_PASSWORD = "secret";
    process.env.BOOKING_FROM_EMAIL = "shop@example.com";
    process.env.BOOKING_FROM_NAME = "S Barbershop";
    process.env.BOOKING_NOTIFICATION_EMAIL = "owner@example.com";
  });

  it("sends the confirmation email to the submitted customer address", async () => {
    await sendBookingEmails({
      customerName: "Alice",
      customerEmail: " Customer@Example.com ",
      customerPhone: "0701234567",
      service: "Herrklippning",
      note: "",
      date: "2026-05-25",
      time: "09:00",
    });

    expect(mocks.sendMail).toHaveBeenCalledTimes(2);
    expect(mocks.sendMail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: "owner@example.com",
        replyTo: "customer@example.com",
      }),
    );
    expect(mocks.sendMail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: "customer@example.com",
      }),
    );
  });
});
