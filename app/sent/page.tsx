import { createClient } from "@supabase/supabase-js";

type SentEmail = {
  id: string;
  email: string;
  subject: string;
  body: string;
  sent_at: string;
};

export default async function SentPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("sent_emails")
    .select("*")
    .order("sent_at", { ascending: false });

  if (error) {
    return <p style={{ color: "red", padding: 24 }}>Error: {error.message}</p>;
  }

  const emails = (data ?? []) as SentEmail[];
  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Sent Emails
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Outbound Log
        </h1>
        <p className="mt-2 text-white/50">
          Review every email your system has sent.
        </p>
      </div>

      <div className={card}>
        {emails.length === 0 ? (
          <p className="text-white/45">No sent emails yet.</p>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className="border-b border-white/10 py-4 last:border-0"
            >
              <p className="font-medium text-white">{email.email}</p>
              <p className="mt-1 text-sm text-orange-300">{email.subject}</p>
              <p className="mt-1 text-xs text-white/35">
                {new Date(email.sent_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}