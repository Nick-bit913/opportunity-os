import { createClient } from "@supabase/supabase-js";
import SendClientCampaignButton from "./send-client-campaign-button";

type Client = {
  id: string;
  name: string;
};

type Campaign = {
  id: string;
  name: string;
  sent_count: number;
  created_at: string;
  client_id?: string | null;
};

export default async function CampaignsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: clientsData } = await supabase
    .from("clients")
    .select("id, name")
    .order("name", { ascending: true });

  const { data: campaignsData } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  const clients = (clientsData ?? []) as Client[];
  const campaigns = (campaignsData ?? []) as Campaign[];
  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Campaigns
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Campaign Control
        </h1>
        <p className="mt-2 text-white/50">
          Launch outreach by client and review campaign history.
        </p>
      </div>

      <div className={card}>
        <h2 className="mb-4 text-xl font-semibold text-white">Send Campaign</h2>
        <SendClientCampaignButton clients={clients} />
      </div>

      <div className={card}>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Campaign History
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-white/45">No campaigns yet.</p>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="font-medium text-white">{campaign.name}</p>
                <p className="text-sm text-white/45">
                  Sent: <span className="text-orange-300">{campaign.sent_count}</span>
                </p>
                <p className="text-xs text-white/35">
                  {new Date(campaign.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}