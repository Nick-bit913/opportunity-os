"use client";

import { useState } from "react";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  score: number;
};

export default function GenerateEmailButton({ lead }: { lead: Lead }) {
  const [loading, setLoading] = useState(false);
  const [emailPreview, setEmailPreview] = useState<{
    subject: string;
    body: string;
  } | null>(null);
  const [sendStatus, setSendStatus] = useState<string>("");

  const handleGenerateAndSend = async () => {
    try {
      setLoading(true);
      setSendStatus("");

      const generateRes = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      });

      if (!generateRes.ok) {
        throw new Error("Failed to generate email");
      }

      const generated = await generateRes.json();
      setEmailPreview(generated);

      const sendRes = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: lead.id,
          email: lead.email,
          subject: generated.subject,
          body: generated.body,
        }),
      });

      const sendData = await sendRes.json();

      if (!sendRes.ok) {
        throw new Error(sendData.error || "Failed to send email");
      }

      setSendStatus("Email sent successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setSendStatus(`Error: ${error.message}`);
      } else {
        setSendStatus("Error: Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        onClick={handleGenerateAndSend}
        className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        {loading ? "Generating & Sending..." : "Generate & Send"}
      </button>

      {sendStatus && (
        <p
          className={`mt-2 text-sm ${
            sendStatus.startsWith("Error") ? "text-red-400" : "text-orange-300"
          }`}
        >
          {sendStatus}
        </p>
      )}

      {emailPreview && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm">
          <p className="font-semibold text-white">Subject:</p>
          <p className="mb-2 text-white/70">{emailPreview.subject}</p>

          <p className="font-semibold text-white">Body:</p>
          <pre className="whitespace-pre-wrap font-sans text-white/70">
            {emailPreview.body}
          </pre>
        </div>
      )}
    </div>
  );
}