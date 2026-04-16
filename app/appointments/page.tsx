import { createClient } from "@supabase/supabase-js";

type Appointment = {
  id: string;
  name: string;
  company: string;
  email: string;
  scheduled_time: string;
};

export default async function AppointmentsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("scheduled_time", { ascending: true });

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const appointments = (data ?? []) as Appointment[];
  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Appointments
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Booked Calls
        </h1>
        <p className="mt-2 text-white/50">
          Track scheduled calls and upcoming conversations.
        </p>
      </div>

      <div className={card}>
        {appointments.length === 0 ? (
          <p className="text-white/45">No appointments yet.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="border-b border-white/10 py-4 last:border-0">
              <p className="font-medium text-white">{appt.name}</p>
              <p className="text-sm text-white/45">
                {appt.company} • {appt.email}
              </p>
              <p className="mt-1 text-sm text-orange-300">
                {new Date(appt.scheduled_time).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}