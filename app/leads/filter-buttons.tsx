"use client";

import Link from "next/link";

export default function FilterButtons({
  selectedStatus,
}: {
  selectedStatus: string;
}) {
  const filters = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Replied", value: "replied" },
    { label: "Interested", value: "interested" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const active = selectedStatus === filter.value;

        return (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/leads"
                : `/leads?status=${filter.value}`
            }
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-orange-500 text-black"
                : "border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}