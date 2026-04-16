"use client";

import { useState } from "react";

export default function SendCampaignButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        onClick={async () => {
          try {
            setLoading(true);
            setMessage("");

            const res = await fetch("/api/campaigns/send", {
              method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || "Failed to send campaign");
            }

            setMessage(`Campaign sent successfully to ${data.sent} leads.`);
          } catch (error) {
            if (error instanceof Error) {
              setMessage(`Error: ${error.message}`);
            } else {
              setMessage("Error: Something went wrong.");
            }
          } finally {
            setLoading(false);
          }
        }}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        {loading ? "Sending Campaign..." : "Send to All Leads"}
      </button>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}