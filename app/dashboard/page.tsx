import { createClient } from "@supabase/supabase-js";

export default async function DashboardPage() {
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

  const recentReplies =
    leads
      ?.filter((l) => l.reply_summary)
      .sort((a, b) => {
        const aTime = a.reply_detected_at
          ? new Date(a.reply_detected_at).getTime()
          : 0;
        const bTime = b.reply_detected_at
          ? new Date(b.reply_detected_at).getTime()
          : 0;
        return bTime - aTime;
      })
      .slice(0, 5) || [];

  const recentAppointments =
    appointments
      ?.sort((a, b) => {
        const aTime = a.scheduled_time
          ? new Date(a.scheduled_time).getTime()
          : 0;
        const bTime = b.scheduled_time
          ? new Date(b.scheduled_time).getTime()
          : 0;
        return aTime - bTime;
      })
      .slice(0, 5) || [];

  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur";
  const sub = "text-sm text-white/45";
  const val = "mt-2 text-3xl font-semibold tracking-tight text-white";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Command Center
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Book More Jobs Dashboard
        </h1>
        <p className="mt-2 text-white/50">
          Monitor pipeline, responses, bookings, and closed opportunities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className={card}>
          <p className={sub}>Total Leads</p>
          <p className={val}>{totalLeads}</p>
        </div>
        <div className={card}>
          <p className={sub}>Emails Sent</p>
          <p className={val}>{totalSent}</p>
        </div>
        <div className={card}>
          <p className={sub}>Replies</p>
          <p className={val}>{repliedLeads}</p>
        </div>
        <div className={card}>
          <p className={sub}>Appointments</p>
          <p className={val}>{totalAppointments}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className={card}>
          <h2 className="text-xl font-semibold text-white">Pipeline</h2>
          <div className="mt-5 space-y-3">
            {[
              { label: "New Leads", value: totalLeads - contactedLeads },
              { label: "Contacted", value: contactedLeads },
              { label: "Replies", value: repliedLeads },
              { label: "Interested", value: interestedLeads },
              { label: "Closed", value: closedLeads },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <span className="text-white/70">{item.label}</span>
                <span className="font-semibold text-orange-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`xl:col-span-2 ${card}`}>
          <h2 className="text-xl font-semibold text-white">Recent Replies</h2>
          <div className="mt-5 space-y-3">
            {recentReplies.length === 0 ? (
              <p className="text-white/45">No replies yet.</p>
            ) : (
              recentReplies.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-sm text-white/45">
                        {lead.company} • {lead.email}
                      </p>
                    </div>
                    <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-medium text-orange-300">
                      {lead.status}
                    </span>
                  </div>

                  {lead.reply_summary && (
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {lead.reply_summary}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={card}>
          <h2 className="text-xl font-semibold text-white">
            Upcoming Appointments
          </h2>
          <div className="mt-5 space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="text-white/45">No appointments booked yet.</p>
            ) : (
              recentAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="font-medium text-white">{appt.name}</p>
                  <p className="text-sm text-white/45">
                    {appt.company} • {appt.email}
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {new Date(appt.scheduled_time).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={card}>
          <h2 className="text-xl font-semibold text-white">System Snapshot</h2>
          <div className="mt-5 grid gap-3">
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
                <p className="text-sm text-white/45">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}