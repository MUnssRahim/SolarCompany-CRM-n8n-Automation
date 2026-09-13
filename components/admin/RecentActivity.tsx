import { Card } from "@/components/ui/Card";
import { timeAgo } from "@/lib/utils";
import { CalendarCheckIcon, FileTextIcon, UsersIcon } from "@/components/ui/icons";
import type { InteractionType } from "@/lib/types";

export type ActivityItem = {
  id: string;
  type: InteractionType | string;
  clientName: string;
  createdAt: string;
  detail?: string;
};

const TYPE_META: Record<
  string,
  { label: string; icon: typeof UsersIcon; tone: string }
> = {
  form_submit: { label: "New Lead Captured", icon: UsersIcon, tone: "bg-brand-100 text-brand-600" },
  quote_generated: { label: "Quote Generated", icon: FileTextIcon, tone: "bg-violet-100 text-violet-600" },
  meeting_booked: { label: "Meeting Booked", icon: CalendarCheckIcon, tone: "bg-emerald-100 text-emerald-600" },
  email_sent: { label: "Email Sent", icon: FileTextIcon, tone: "bg-sky-100 text-sky-600" },
  follow_up: { label: "Follow-up Sent", icon: FileTextIcon, tone: "bg-sky-100 text-sky-600" },
};

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-slate-900">Recent Activity</p>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nothing yet — activity will show up here.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {items.map((item) => {
            const meta = TYPE_META[item.type] ?? {
              label: item.type,
              icon: FileTextIcon,
              tone: "bg-slate-100 text-slate-500",
            };
            return (
              <li key={item.id} className="flex items-start gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{meta.label}</p>
                  <p className="truncate text-sm text-slate-500">
                    {item.detail ?? item.clientName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{timeAgo(item.createdAt)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
