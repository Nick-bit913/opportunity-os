"use client";

import { useState } from "react";

export default function BookCallButton({
  lead,
}: {
  lead: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
}) {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />

      <button
        onClick={async () => {
          if (!time) return alert("Pick a time");

          setLoading(true);

          await fetch("/api/appointments/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leadId: lead.id,
              name: lead.name,
              company: lead.company,
              email: lead.email,
              scheduledTime: time,
            }),
          });

          setLoading(false);
          window.location.reload();
        }}
        className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        {loading ? "Booking..." : "Book Call"}
      </button>
    </div>
  );
}