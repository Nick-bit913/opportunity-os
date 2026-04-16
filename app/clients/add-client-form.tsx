"use client";

import { useState } from "react";

export default function AddClientForm() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          industry,
          contactName,
          contactEmail,
          monthlyValue: monthlyValue ? Number(monthlyValue) : 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create client");
      }

      setMessage("Client added successfully.");
      setName("");
      setIndustry("");
      setContactName("");
      setContactEmail("");
      setMonthlyValue("");

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Error: Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <h2 className="text-xl font-semibold text-white">Add Client</h2>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client / Company Name"
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm"
        />

        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Industry"
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm"
        />

        <input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Contact Name"
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm"
        />

        <input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Contact Email"
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm"
        />

        <input
          value={monthlyValue}
          onChange={(e) => setMonthlyValue(e.target.value)}
          placeholder="Monthly Value"
          type="number"
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        {loading ? "Saving..." : "Add Client"}
      </button>

      {message && <p className="mt-3 text-sm text-white/60">{message}</p>}
    </div>
  );
}