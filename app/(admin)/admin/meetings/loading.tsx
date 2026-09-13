import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/admin/Skeleton";

export default function AdminMeetingsLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="mt-2 h-4 w-64" />

      <Card className="mt-6 overflow-hidden">
        <div className="flex gap-3 border-b border-slate-200 p-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-8 w-56" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
