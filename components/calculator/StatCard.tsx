import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatCard({
  icon,
  label,
  value,
  helper,
  tone = "default",
  progress,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper?: string;
  tone?: "default" | "emerald";
  progress?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "emerald"
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white"
      )}
    >
      <div className="flex items-center gap-2 text-slate-500">
        <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className={cn(
          "mt-2 text-2xl font-bold tracking-tight",
          tone === "emerald" ? "text-emerald-700" : "text-slate-900"
        )}
      >
        {value}
      </p>
      {typeof progress === "number" && (
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500"
            style={{ width: `${Math.min(100, Math.max(4, progress))}%` }}
          />
        </div>
      )}
      {helper && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            tone === "emerald" ? "text-emerald-600" : "text-slate-500"
          )}
        >
          {helper}
        </p>
      )}
    </div>
  );
}
