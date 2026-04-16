"use client";

export default function InboxStatusButtons({ leadId }: { leadId: string }) {
  const update = async (status: string) => {
    await fetch("/api/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: leadId, status }),
    });

    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-2 min-w-[130px]">
      <button
        onClick={() => update("interested")}
        className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-black transition hover:bg-orange-400"
      >
        Interested
      </button>

      <button
        onClick={() => update("replied")}
        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white transition hover:bg-white/[0.06]"
      >
        Keep Open
      </button>

      <button
        onClick={() => update("closed")}
        className="rounded-xl border border-orange-400/30 bg-orange-400/10 px-3 py-2 text-sm font-medium text-orange-300 transition hover:bg-orange-400/20"
      >
        Closed
      </button>
    </div>
  );
}