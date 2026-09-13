import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/admin/Skeleton";

// Shown automatically while page.tsx's data fetch (Supabase + the n8n
// dashboard webhook, which is genuinely slow — see page.tsx) is in flight.
export default function AdminDashboardLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-72" />

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="mt-4 h-7 w-16" />
            <Skeleton className="mt-2 h-4 w-24" />
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-1 h-3 w-24" />
          <div className="mt-6 flex h-40 items-end gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full" style={{ height: `${30 + (i % 4) * 15}%` }} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Skeleton className="h-4 w-28" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
