import { createClient } from "@supabase/supabase-js";

export default async function AgentsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: leads } = await supabase.from("leads").select("*");
  const { data: sentEmails } = await supabase.from("sent_emails").select("*");
  const { data: appointments } = await supabase.from("appointments").select("*");

  const totalLeads = leads?.length || 0;
  const contactedLeads = leads?.filter((l) => l.contacted).length || 0;
  const repliedLeads =
    leads?.filter((l) =>
      ["replied", "interested", "closed"].includes(l.status)
    ).length || 0;
  const interestedLeads =
    leads?.filter((l) => l.status === "interested").length || 0;
  const closedLeads = leads?.filter((l) => l.status === "closed").length || 0;
  const totalSent = sentEmails?.length || 0;
  const totalAppointments = appointments?.length || 0;

  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Agents
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Agent Performance
        </h1>
        <p className="mt-2 text-white/50">
          Monitor the system that drives outreach, replies, and bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[
          { label: "Total Leads", value: totalLeads },
          { label: "Contacted", value: contactedLeads },
          { label: "Replies", value: repliedLeads },
          { label: "Interested", value: interestedLeads },
          { label: "Closed", value: closedLeads },
          { label: "Emails Sent", value: totalSent },
          { label: "Appointments", value: totalAppointments },
        ].map((item) => (
          <div key={item.label} className={card}>
            <p className="text-sm text-white/45">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-orange-300">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="text-xl font-semibold text-white">Agent Status</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Lead Agent", value: `Managing ${totalLeads} leads` },
              { label: "Email Agent", value: `Sent ${totalSent} emails` },
              { label: "Reply Agent", value: `Detected ${repliedLeads} replies` },
              {
                label: "Booking Agent",
                value: `Scheduled ${totalAppointments} calls`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-sm text-white/45">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <h2 className="text-xl font-semibold text-white">Funnel Snapshot</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Total Leads", value: totalLeads },
              { label: "Contacted", value: contactedLeads },
              { label: "Replied", value: repliedLeads },
              { label: "Interested", value: interestedLeads },
              { label: "Booked Calls", value: totalAppointments },
              { label: "Closed", value: closedLeads },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <span className="text-white/70">{item.label}</span>
                <span className="font-semibold text-orange-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}