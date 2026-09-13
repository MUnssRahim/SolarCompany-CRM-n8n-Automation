// Types mirroring the Supabase schema. These enums match the actual
// `check` constraints on the live tables (clients_status_check,
// clients_source_check, interactions_type_check, meetings_status_check) —
// keep them in sync with the database if those constraints ever change.

export type ClientStatus = "active" | "inactive" | "converted";

export type ClientSource = "contact_form" | "calculator" | "meeting_booking";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: ClientSource | string;
  status: ClientStatus | string;
  created_at: string;
};

export type MeetingStatus = "scheduled" | "completed" | "no_show" | "cancelled";

export type Meeting = {
  id: string;
  client_id: string;
  date: string; // ISO date, e.g. 2026-08-24
  time: string; // e.g. 14:00
  status: MeetingStatus | string;
  notes: string | null;
  created_at: string;
};

export type Quote = {
  id: string;
  client_id: string;
  monthly_bill: number;
  system_size_kw: number;
  num_panels: number;
  estimated_cost: number;
  monthly_savings: number;
  payback_years: number;
  created_at: string;
};

export type InteractionType =
  | "form_submit"
  | "quote_generated"
  | "meeting_booked"
  | "email_sent"
  | "follow_up";

export type Interaction = {
  id: string;
  client_id: string;
  type: InteractionType | string;
  details: Record<string, unknown> | null;
  created_at: string;
};

// Convenience joined shapes used by the admin pages.
export type ClientWithRelations = Client & {
  meetings: Meeting[];
  interactions: Interaction[];
  quotes: Quote[];
};

export type MeetingWithClient = Meeting & {
  clients: Pick<Client, "id" | "name" | "email" | "phone"> | null;
};

export type AgentDefinition = {
  key: "lead-capture" | "quote-generator" | "meeting-booker" | "follow-up";
  name: string;
  description: string;
  workflowId: string | undefined;
};
