export type MonthlyCount = { label: string; count: number };

export function LeadTrendChart({ data }: { data: MonthlyCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      <div className="flex h-40 items-stretch gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="group relative flex w-full flex-1 justify-center">
              <div
                title={`${d.label}: ${d.count} lead${d.count === 1 ? "" : "s"}`}
                className="absolute bottom-0 w-full max-w-9 rounded-t-md bg-brand-500 transition-colors group-hover:bg-brand-600"
                style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
