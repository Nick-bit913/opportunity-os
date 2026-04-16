"use client";

import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
};

export default function AddLeadButton() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      const res = await fetch("/api/clients/list");
      const data = await res.json();
      setClients(data.clients || []);
    };

    loadClients();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />
      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />

      <select
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"
      >
        <option value="">No Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <button
        onClick={async () => {
          await fetch("/api/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              company,
              email,
              clientId,
            }),
          });

          setName("");
          setCompany("");
          setEmail("");
          setClientId("");

          window.location.reload();
        }}
        className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        Add
      </button>
    </div>
  );
}