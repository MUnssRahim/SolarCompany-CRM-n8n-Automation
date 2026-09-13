import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { ExternalLinkButton } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Badge } from "@/components/ui/Badge";
import { ClockIcon } from "@/components/ui/icons";
import { timeAgo } from "@/lib/utils";

export function AgentCard({
  icon,
  name,
  description,
  editorUrl,
  lastTriggeredAt,
}: {
  icon: ReactNode;
  name: string;
  description: string;
  /** Direct link to this workflow in n8n's own editor, or null if not configured. */
  editorUrl: string | null;
  lastTriggeredAt: string | null;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <IconTile tone="navy">{icon}</IconTile>
        <Badge
          className={
            editorUrl ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
          }
        >
          {editorUrl ? "Configured" : "Not configured"}
        </Badge>
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">{name}</h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>

      {lastTriggeredAt && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <ClockIcon className="h-3.5 w-3.5" />
          Last triggered: {timeAgo(lastTriggeredAt)}
        </p>
      )}

      <div className="mt-4">
        <ExternalLinkButton
          href={editorUrl ?? "#"}
          size="sm"
          className={editorUrl ? "w-full" : "w-full pointer-events-none opacity-50"}
        >
          {editorUrl ? "View Workflow in n8n ↗" : "Workflow not configured"}
        </ExternalLinkButton>
      </div>
    </Card>
  );
}
