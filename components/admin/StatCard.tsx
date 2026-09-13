import { Card } from "@/components/ui/Card";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/utils";
import { TrendingDownIcon, TrendingUpIcon } from "@/components/ui/icons";
import type { ReactNode } from "react";

export function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  /** Positive or negative percent change vs. the prior period, if known. */
  trend?: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <IconTile tone="navy" size="sm">
          {icon}
        </IconTile>
        {typeof trend === "number" && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            )}
          >
            {trend >= 0 ? (
              <TrendingUpIcon className="h-3 w-3" />
            ) : (
              <TrendingDownIcon className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Card>
  );
}
