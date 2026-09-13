import "server-only";

/**
 * n8n helpers — deliberately does NOT call the n8n REST API
 * (GET/activate/deactivate /api/v1/workflows/...). That API requires a
 * paid n8n plan; this project runs on a free-trial instance with no
 * N8N_API_KEY available, so the Agents page instead just links out to the
 * real workflow in n8n (`workflowEditorUrl`), and status/activation
 * management happens in n8n's own UI.
 */

const PLACEHOLDER_VALUES = new Set([
  "your_n8n_api_key_here",
  "workflow_id_1",
  "workflow_id_2",
  "workflow_id_3",
  "workflow_id_4",
]);

export function isRealValue(value: string | undefined): value is string {
  return Boolean(value && !PLACEHOLDER_VALUES.has(value));
}

export function workflowEditorUrl(workflowId: string): string | null {
  const base = process.env.N8N_BASE_URL?.replace(/\/$/, "");
  if (!isRealValue(base)) return null;
  return `${base}/workflow/${workflowId}`;
}
