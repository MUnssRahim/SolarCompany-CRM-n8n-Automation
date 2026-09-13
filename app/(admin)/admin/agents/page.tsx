import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isRealValue, workflowEditorUrl } from "@/lib/n8n";
import { AgentCard } from "@/components/admin/AgentCard";
import { BotIcon, CalendarCheckIcon, FileTextIcon, UsersIcon } from "@/components/ui/icons";
import type { AgentDefinition, InteractionType } from "@/lib/types";

export const metadata: Metadata = { title: "Agents" };

const AGENTS: (AgentDefinition & {
  icon: typeof BotIcon;
  interactionType: InteractionType;
})[] = [
  {
    key: "lead-capture",
    name: "Lead Capture",
    description:
      "Watches the landing page contact form and calculator submissions, extracting contact details to populate the CRM.",
    workflowId: process.env.N8N_WORKFLOW_ID_LEAD_CAPTURE,
    icon: UsersIcon,
    interactionType: "form_submit",
  },
  {
    key: "quote-generator",
    name: "Quote Generator",
    description:
      "Calculates solar potential from calculator submissions and generates a detailed, engineer-reviewed proposal.",
    workflowId: process.env.N8N_WORKFLOW_ID_QUOTE_GENERATION,
    icon: FileTextIcon,
    interactionType: "quote_generated",
  },
  {
    key: "meeting-booker",
    name: "Meeting Booker",
    description:
      "Syncs consultation bookings from the site, confirms availability, and sends calendar invites automatically.",
    workflowId: process.env.N8N_WORKFLOW_ID_MEETING_BOOKING,
    icon: CalendarCheckIcon,
    interactionType: "meeting_booked",
  },
  {
    key: "follow-up",
    name: "Follow-up",
    description:
      "Re-engages leads who haven't responded to a quote or booking after 72 hours with a friendly nudge.",
    workflowId: process.env.N8N_WORKFLOW_ID_FOLLOW_UP,
    icon: BotIcon,
    interactionType: "follow_up",
  },
];

export default async function AdminAgentsPage() {
  const supabase = await createClient();

  const lastInteractions = await Promise.all(
    AGENTS.map(async (agent) => {
      const { data } = await supabase
        .from("interactions")
        .select("created_at")
        .eq("type", agent.interactionType)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return (data?.created_at as string | undefined) ?? null;
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Automation Agents</h1>
      <p className="mt-1 text-sm text-slate-500">
        Review each n8n agent — activity here comes from Supabase; open a
        workflow in n8n to inspect or change it.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {AGENTS.map((agent, i) => {
          // Placeholder workflow IDs (the "workflow_id_1" stand-ins from
          // the env template) are treated the same as an unset var.
          const workflowId = isRealValue(agent.workflowId) ? agent.workflowId : null;
          return (
            <AgentCard
              key={agent.key}
              icon={<agent.icon />}
              name={agent.name}
              description={agent.description}
              editorUrl={workflowId ? workflowEditorUrl(workflowId) : null}
              lastTriggeredAt={lastInteractions[i]}
            />
          );
        })}
      </div>
    </div>
  );
}
