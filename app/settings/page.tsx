export default function SettingsPage() {
  const card =
    "rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Settings
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          System Connections
        </h1>
        <p className="mt-2 text-white/50">
          Connect inboxes and configure the engine behind your outreach system.
        </p>
      </div>

      <div className={card}>
        <h2 className="text-xl font-semibold text-white">Gmail Integration</h2>
        <p className="mt-2 text-sm text-white/50">
          Connect your Gmail inbox so the system can detect replies
          automatically.
        </p>

        <a
          href="/api/gmail/connect"
          className="mt-5 inline-block rounded-2xl bg-orange-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-400"
        >
          Connect Gmail
        </a>
      </div>

      <div className={card}>
        <h2 className="text-xl font-semibold text-white">Email Sending</h2>
        <p className="mt-2 text-sm text-white/50">
          Your sending domain should be verified in Resend before live campaigns
          run automatically.
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/65">
          Current sending brand: <span className="text-orange-300">bookmorejobs.net</span>
        </div>
      </div>
    </div>
  );
}