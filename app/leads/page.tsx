import { createClient } from "@supabase/supabase-js";
import AddLeadButton from "./add-lead-button";
import GenerateEmailButton from "./generate-email-button";
import UpdateStatusButton from "./update-status-button";
import FilterButtons from "./filter-buttons";
import CheckRepliesButton from "./check-replies-button";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  score: number;
  reply_summary?: string | null;
  client_id?: string | null;
  clients?: {
    name: string;
  } | null;
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus = params.status || "all";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("leads")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  if (selectedStatus !== "all") {
    query = query.eq("status", selectedStatus);
  }

  const { data: leads, error } = await query;

  if (error) {
    return <p style={{ color: "red", padding: 24 }}>Error: {error.message}</p>;
  }

  const typedLeads = (leads ?? []) as Lead[];
  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
            Leads
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Outreach Pipeline
          </h1>
          <p className="mt-2 text-white/50">Track outreach, replies, and client-linked leads.</p>
        </div>

        <div className="flex gap-2">
          <CheckRepliesButton />
          <AddLeadButton />
        </div>
      </div>

      <FilterButtons selectedStatus={selectedStatus} />

      <div className={card}>
        {typedLeads.length === 0 ? (
          <p className="text-white/45">No leads found yet.</p>
        ) : (
          typedLeads.map((lead) => (
            <div key={lead.id} className="border-b border-white/10 py-4 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="text-sm text-white/45">
                    {lead.company} • {lead.email}
                  </p>
                  {lead.clients?.name && (
                    <p className="text-sm text-orange-300">
                      Client: {lead.clients.name}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-white/70">
                    Status: <span className="font-semibold text-white">{lead.status}</span>
                  </p>

                  {lead.reply_summary && (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white/70">
                      <p className="mb-1 font-semibold text-white">Latest Reply Preview</p>
                      <p>{lead.reply_summary}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <GenerateEmailButton lead={lead} />
                  <UpdateStatusButton leadId={lead.id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}