import fs from "node:fs/promises";
import path from "node:path";

type BookingRecord = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  note?: string;
  date: string;
  time: string;
  createdAt: string;
};

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

async function getBookings(): Promise<BookingRecord[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf8");
    const bookings = JSON.parse(raw) as BookingRecord[];
    return bookings.sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
  } catch {
    return [];
  }
}

export default async function SBookingsPage() {
  const bookings = await getBookings();

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-heading font-semibold mb-4">S Barbershop Bokningar</h1>
        <p className="text-muted-foreground mb-8">
          Visar bokningar sparade i JSON-filen.
        </p>

        {bookings.length === 0 ? (
          <p className="text-muted-foreground">Inga bokningar registrerade ännu.</p>
        ) : (
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Tid</th>
                  <th className="px-4 py-3">Namn</th>
                  <th className="px-4 py-3">Telefon</th>
                  <th className="px-4 py-3">E-post</th>
                  <th className="px-4 py-3">Tjänst</th>
                  <th className="px-4 py-3">Meddelande</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-border">
                    <td className="px-4 py-3">{booking.date}</td>
                    <td className="px-4 py-3">{booking.time}</td>
                    <td className="px-4 py-3">{booking.customerName}</td>
                    <td className="px-4 py-3">{booking.customerPhone}</td>
                    <td className="px-4 py-3">{booking.customerEmail}</td>
                    <td className="px-4 py-3">{booking.service}</td>
                    <td className="px-4 py-3">{booking.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
