"use client";

import { useState } from "react";

export default function CheckRepliesButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        onClick={async () => {
          setLoading(true);
          setMessage("");

          const res = await fetch("/api/gmail/check-replies", {
            method: "POST",
          });

          const data = await res.json();

          if (!res.ok) {
            setMessage(data.error || "Failed to check replies");
          } else {
            setMessage(`Inbox checked. Updated ${data.matched} leads.`);
          }

          setLoading(false);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }}
        className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        {loading ? "Checking..." : "Check Replies"}
      </button>

      {message && <p className="mt-2 text-sm text-white/60">{message}</p>}
    </div>
  );
}