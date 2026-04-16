"use client";

import { useState } from "react";

export default function SendClientPageCampaignButton({
  clientId,
}: {
  clientId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={async () => {
          setLoading(true);
          setMessage("");

          const res = await fetch("/api/campaigns/send-client", {
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

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }}
        className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        {loading ? "Sending..." : "Send Campaign"}
      </button>

      {message && <p className="text-sm text-white/60">{message}</p>}
    </div>
  );
}