import { createClient } from "@supabase/supabase-js";
import InboxStatusButtons from "./inbox-status-buttons";
import BookCallButton from "./book-call-button";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  reply_summary?: string | null;
  reply_detected_at?: string | null;
};

export default async function InboxPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .in("status", ["replied", "interested"])
    .order("reply_detected_at", { ascending: false });

  if (error) {
    return <p style={{ color: "red", padding: 24 }}>Error: {error.message}</p>;
  }

  const leads = (data ?? []) as Lead[];
  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Inbox
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Reply Review
        </h1>
        <p className="mt-2 text-white/50">
          Review conversations and move hot leads forward.
        </p>
      </div>

      <div className={card}>
        {leads.length === 0 ? (
          <p className="text-white/45">No active conversations.</p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="border-b border-white/10 py-4 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="text-sm text-white/45">
                    {lead.company} • {lead.email}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Status: <span className="font-semibold text-orange-300">{lead.status}</span>
                  </p>

                  {lead.reply_summary && (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white/70">
                      <p className="mb-1 font-semibold text-white">Reply</p>
                      <p>{lead.reply_summary}</p>
                    </div>
                  )}

                  <BookCallButton lead={lead} />
                </div>

                <InboxStatusButtons leadId={lead.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}