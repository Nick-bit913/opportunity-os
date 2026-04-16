import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import AddClientForm from "./add-client-form";

type Client = {
  id: string;
  name: string;
  industry: string | null;
  contact_name: string | null;
  contact_email: string | null;
  monthly_value: number | null;
  status: string;
  created_at: string;
};

export default async function ClientsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p style={{ color: "red", padding: 24 }}>Error: {error.message}</p>;
  }

  const clients = (data ?? []) as Client[];

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "active").length;
  const totalMRR = clients.reduce(
    (sum, client) => sum + Number(client.monthly_value || 0),
    0
  );

  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Clients
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Client Accounts
        </h1>
        <p className="mt-2 text-white/50">
          Manage active accounts, contacts, and monthly value.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className={card}>
          <p className="text-sm text-white/45">Total Clients</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {totalClients}
          </p>
        </div>
        <div className={card}>
          <p className="text-sm text-white/45">Active Clients</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {activeClients}
          </p>
        </div>
        <div className={card}>
          <p className="text-sm text-white/45">Monthly Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-orange-300">
            ${totalMRR.toLocaleString()}
          </p>
        </div>
      </div>

      <AddClientForm />

      <div className={card}>
        <h2 className="text-xl font-semibold text-white">Client List</h2>

        <div className="mt-5 space-y-4">
          {clients.length === 0 ? (
            <p className="text-white/45">No clients added yet.</p>
          ) : (
            clients.map((client) => (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="block rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-orange-400/30 hover:bg-black/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-sm text-white/45">
                      {client.industry || "No industry"} •{" "}
                      {client.contact_name || "No contact"}
                    </p>
                    <p className="text-sm text-white/45">
                      {client.contact_email || "No email"}
                    </p>
                    <p className="mt-2 text-xs text-white/30">
                      ID: {client.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/45">Monthly Value</p>
                    <p className="font-semibold text-orange-300">
                      ${Number(client.monthly_value || 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{client.status}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}