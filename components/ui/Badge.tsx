import { cn } from "@/lib/utils";
import type { ClientStatus, MeetingStatus } from "@/lib/types";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

const clientStatusStyles: Record<string, string> = {
  active: "bg-sky-100 text-sky-700",
  converted: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
};

export function ClientStatusBadge({ status }: { status: ClientStatus | string }) {
  return (
    <Badge className={clientStatusStyles[status] ?? "bg-slate-100 text-slate-600"}>
      {status.replace("_", " ")}
    </Badge>
  );
}

const meetingStatusStyles: Record<string, string> = {
  scheduled: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  no_show: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

export function MeetingStatusBadge({ status }: { status: MeetingStatus | string }) {
  return (
    <Badge className={meetingStatusStyles[status] ?? "bg-slate-100 text-slate-600"}>
      {status.replace("_", " ")}
    </Badge>
  );
}
