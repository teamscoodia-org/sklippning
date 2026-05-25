import nodemailer, { type Transporter } from "nodemailer";

type BookingEmailPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  note?: string;
  date: string;
  time: string;
};

type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  notificationEmail: string;
};

let cachedTransporter: Transporter | null = null;
let cachedTransportKey = "";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getMailConfig(): MailConfig {
  const host = process.env.LOOPIA_SMTP_HOST?.trim();
  const user = process.env.LOOPIA_SMTP_USER?.trim();
  const pass = process.env.LOOPIA_SMTP_PASSWORD?.trim();
  const port = Number(process.env.LOOPIA_SMTP_PORT || "587");
  const secure =
    process.env.LOOPIA_SMTP_SECURE != null
      ? process.env.LOOPIA_SMTP_SECURE === "true"
      : port === 465;
  const fromEmail = process.env.BOOKING_FROM_EMAIL?.trim() || user;
  const fromName = process.env.BOOKING_FROM_NAME?.trim() || "S Barbershop";
  const notificationEmail =
    process.env.BOOKING_NOTIFICATION_EMAIL?.trim() || user;

  const missing: string[] = [];
  if (!host) missing.push("LOOPIA_SMTP_HOST");
  if (!user) missing.push("LOOPIA_SMTP_USER");
  if (!pass) missing.push("LOOPIA_SMTP_PASSWORD");
  if (!fromEmail) missing.push("BOOKING_FROM_EMAIL");
  if (!notificationEmail) missing.push("BOOKING_NOTIFICATION_EMAIL");

  if (missing.length > 0) {
    throw new Error(
      `Booking email is not configured. Missing: ${missing.join(", ")}`,
    );
  }

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("LOOPIA_SMTP_PORT must be a valid positive number.");
  }

  const safeHost = host as string;
  const safeUser = user as string;
  const safePass = pass as string;
  const safeFromEmail = fromEmail as string;
  const safeNotificationEmail = notificationEmail as string;

  return {
    host: safeHost,
    port,
    secure,
    user: safeUser,
    pass: safePass,
    fromEmail: safeFromEmail,
    fromName,
    notificationEmail: safeNotificationEmail,
  };
}

function getTransporter(config: MailConfig): Transporter {
  const transportKey = [
    config.host,
    config.port,
    config.secure,
    config.user,
    config.fromEmail,
    config.notificationEmail,
  ].join("|");

  if (!cachedTransporter || cachedTransportKey !== transportKey) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    cachedTransportKey = transportKey;
  }

  return cachedTransporter;
}

function buildHtmlMessage(
  title: string,
  intro: string,
  booking: BookingEmailPayload,
): string {
  const note = booking.note?.trim() || "-";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(title)}</h2>
      <p style="margin-bottom: 16px;">${escapeHtml(intro)}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">Datum</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(booking.date)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">Tid</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(booking.time)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">Tjanst</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(booking.service)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">Namn</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(booking.customerName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">E-post</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(booking.customerEmail)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">Telefon</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(booking.customerPhone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">Meddelande</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${escapeHtml(note)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `.trim();
}

function buildTextMessage(intro: string, booking: BookingEmailPayload): string {
  const note = booking.note?.trim() || "-";

  return [
    intro,
    "",
    `Datum: ${booking.date}`,
    `Tid: ${booking.time}`,
    `Tjanst: ${booking.service}`,
    `Namn: ${booking.customerName}`,
    `E-post: ${booking.customerEmail}`,
    `Telefon: ${booking.customerPhone}`,
    `Meddelande: ${note}`,
  ].join("\n");
}

export async function sendBookingEmails(
  booking: BookingEmailPayload,
): Promise<void> {
  const config = getMailConfig();
  const transporter = getTransporter(config);
  const from = `"${config.fromName}" <${config.fromEmail}>`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: config.notificationEmail,
      replyTo: booking.customerEmail,
      subject: `Ny bokning - ${booking.date} ${booking.time}`,
      text: buildTextMessage("En ny bokning har sparats.", booking),
      html: buildHtmlMessage(
        "Ny bokning",
        "En ny bokning har sparats via hemsidan.",
        booking,
      ),
    }),
    transporter.sendMail({
      from,
      to: booking.customerEmail,
      subject: `Bekraftelse pa din bokning - ${booking.date} ${booking.time}`,
      text: buildTextMessage(
        "Tack! Din bokning hos S Barbershop ar mottagen.",
        booking,
      ),
      html: buildHtmlMessage(
        "Din bokning ar mottagen",
        "Tack! Vi har tagit emot din bokning hos S Barbershop.",
        booking,
      ),
    }),
  ]);
}
