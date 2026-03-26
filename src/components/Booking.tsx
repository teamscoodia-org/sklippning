"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";

type Slot = {
  id: string;
  date: string;
  time: string;
};

const services = [
  "Herrklippning",
  "Barnklippning",
  "Damklippning",
  "Skäggtrimning",
  "Huvudrakning",
  "Trådning hela ansikte",
  "Trådning ögonbryn",
  "Huvudmassage med olja",
  "Ansiktsmassage",
];

const Booking = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [formState, setFormState] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    service: services[0],
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data: { slots: Slot[] }) => {
        setSlots(data.slots || []);
      })
      .finally(() => setLoadingSlots(false));
  }, []);

  const groupedSlots = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formState,
        slotId: selectedSlotId,
      }),
    });

    const data = (await res.json()) as { message?: string; emailSent?: boolean };
    if (!res.ok) {
      setMessage(data.message || "Nagot gick fel. Forsok igen.");
      setSubmitting(false);
      return;
    }

    setSlots((prev) => prev.filter((slot) => slot.id !== selectedSlotId));
    setSelectedSlotId("");
    setFormState((prev) => ({ ...prev, note: "" }));

    if (data.emailSent) {
      setMessage("Bokningen ar klar! Vi har skickat bokningen via e-post.");
    } else {
      setMessage("Bokningen ar sparad, men e-post kunde inte skickas.");
    }

    setSubmitting(false);
  };

  return (
    <section id="boka" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <CalendarClock className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-heading font-semibold mb-4">
            Boka <span className="text-gradient-gold">Tid</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Välj tjänst och ledig tid, så bekräftar vi din bokning.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input
              required
              value={formState.customerName}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, customerName: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3"
              placeholder="Namn"
            />
            <input
              required
              type="email"
              value={formState.customerEmail}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, customerEmail: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3"
              placeholder="E-post"
            />
            <input
              required
              value={formState.customerPhone}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, customerPhone: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3"
              placeholder="Telefon"
            />
            <select
              value={formState.service}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, service: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3"
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <textarea
              value={formState.note}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, note: e.target.value }))
              }
              className="w-full rounded border border-border bg-background px-4 py-3 min-h-[120px]"
              placeholder="Meddelande (valfritt)"
            />
          </div>

          <div className="rounded border border-border p-4">
            <p className="font-medium mb-3">Lediga tider</p>
            {loadingSlots ? (
              <p className="text-muted-foreground text-sm">Laddar tider...</p>
            ) : slots.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Inga lediga tider just nu.
              </p>
            ) : (
              <div className="space-y-4 max-h-[340px] overflow-auto pr-1">
                {Object.entries(groupedSlots).map(([date, daySlots]) => (
                  <div key={date}>
                    <p className="text-sm font-medium mb-2">{date}</p>
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`px-3 py-2 rounded border text-sm transition-colors ${
                            selectedSlotId === slot.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting || !selectedSlotId}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Skickar..." : "Boka nu"}
            </button>
            {message ? (
              <p className="mt-3 text-sm text-muted-foreground">{message}</p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Booking;
