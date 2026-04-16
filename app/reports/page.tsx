export default function ReportsPage() {
  const reports = [
    { id: "1", title: "CoolAir HVAC Weekly Report", date: "Apr 14, 2026" },
    { id: "2", title: "Apex Roofing Performance Report", date: "Apr 13, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500">Client reporting and performance summaries</p>
        </div>

        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">
          Generate Report
        </button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="text-sm text-gray-500">{report.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}