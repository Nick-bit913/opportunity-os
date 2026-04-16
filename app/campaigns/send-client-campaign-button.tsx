"use client";

import { useState } from "react";

type Client = {
  id: string;
  name: string;
};

export default function SendClientCampaignButton({
  clients,
}: {
  clients: Client[];
}) {
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-3">
      <select
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white"
      >
        <option value="">All Leads</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <button
        onClick={async () => {
          setLoading(true);
          setMessage("");

          const res = await fetch("/api/campaigns/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clientId }),
          });

          const data = await res.json();

          if (!res.ok) {
            setMessage(data.error || "Failed to send campaign");
          } else {
            setMessage(`Campaign sent to ${data.sent} leads.`);
          }

          setLoading(false);
        }}
        className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        {loading ? "Sending..." : "Send Campaign"}
      </button>

      {message && <p className="text-sm text-white/60">{message}</p>}
    </div>
  );
}