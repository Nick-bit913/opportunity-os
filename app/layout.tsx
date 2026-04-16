import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Book More Jobs",
  description: "AI-powered outreach and booking system",
};

const navItems = [
  { href: "/dashboard", label: "Command Center" },
  { href: "/clients", label: "Clients" },
  { href: "/leads", label: "Leads" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/sent", label: "Sent Emails" },
  { href: "/inbox", label: "Inbox" },
  { href: "/appointments", label: "Appointments" },
  { href: "/agents", label: "Agents" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white">
        <div className="flex min-h-screen bg-[#050505]">
          <aside className="w-72 border-r border-white/10 bg-[#0a0a0a]">
            <div className="border-b border-white/10 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-black shadow-lg">
                  BMJ
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Book More Jobs
                  </h2>
                  <p className="text-sm text-white/40">
                    Ominous Growth System
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-orange-500/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#080808] px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
                  Live System
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Book More Jobs OS
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60">
                Owner View
              </div>
            </header>

            <main className="flex-1 bg-gradient-to-b from-[#050505] to-[#111111] p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}