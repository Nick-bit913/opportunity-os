import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SendClientPageCampaignButton from "./send-client-page-campaign-button";

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

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
};

type Appointment = {
  id: string;
  name: string;
  company: string;
  email: string;
  scheduled_time: string;
};

type Campaign = {
  id: string;
  name: string;
  sent_count: number;
  created_at: string;
};

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!client) {
    return (
      <div className="p-6 text-red-400">
        Client not found
      </div>
    );
  }

  const { data: leadsData } = await supabase
    .from("leads")
    .select("*")
    .eq("client_id", id);

  const leads = (leadsData ?? []) as Lead[];

  const { data: campaignData } = await supabase
    .from("campaigns")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const campaigns = (campaignData ?? []) as Campaign[];

  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6";

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-400">
            Client
          </p>
          <h1 className="text-4xl font-semibold mt-2">
            {client.name}
          </h1>
        </div>

        <div className="flex gap-3">
          <SendClientPageCampaignButton clientId={client.id} />
          <Link
            href="/clients"
            className="px-4 py-3 rounded-xl border border-white/10"
          >
            Back
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className={card}>
          <p className="text-white/50 text-sm">Leads</p>
          <p className="text-3xl mt-2">{leads.length}</p>
        </div>

        <div className={card}>
          <p className="text-white/50 text-sm">Monthly Value</p>
          <p className="text-3xl mt-2 text-orange-300">
            ${client.monthly_value || 0}
          </p>
        </div>

        <div className={card}>
          <p className="text-white/50 text-sm">Status</p>
          <p className="text-3xl mt-2">{client.status}</p>
        </div>
      </div>

      {/* CAMPAIGNS */}
      <div className={card}>
        <h2 className="text-xl font-semibold mb-4">
          Campaign History
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-white/50">
            No campaigns yet
          </p>
        ) : (
          campaigns.map((c) => (
            <div
              key={c.id}
              className="border-b border-white/10 py-3"
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-white/50">
                Sent:{" "}
                <span className="text-orange-300">
                  {c.sent_count}
                </span>
              </p>
              <p className="text-xs text-white/40">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* LEADS */}
      <div className={card}>
        <h2 className="text-xl font-semibold mb-4">
          Leads
        </h2>

        {leads.length === 0 ? (
          <p className="text-white/50">No leads</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="border-b border-white/10 py-3"
            >
              <p>{lead.name}</p>
              <p className="text-sm text-white/50">
                {lead.company} • {lead.email}
              </p>
              <p className="text-sm text-orange-300">
                {lead.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}