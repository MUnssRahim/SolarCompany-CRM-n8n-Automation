"use client";

export type WebhookResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; data: null };

/**
 * POST to a public n8n webhook and return its parsed JSON body. Never
 * throws — returns `{ ok: false, data: null }` (without an error field
 * clients can accidentally forget to check) when the webhook env var
 * isn't configured yet, the request fails, or the response isn't valid
 * JSON, so pages keep working in local/demo environments before n8n
 * workflows are wired up.
 */
export async function postToWebhook<T = unknown>(
  url: string | undefined,
  payload: Record<string, unknown>
): Promise<WebhookResult<T>> {
  if (!url) {
    console.warn("[webhook] No webhook URL configured — skipping n8n call.");
    return { ok: false, data: null };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => null);
    // n8n's documented success shape is `{ success: true, ... }`; treat an
    // explicit `success: false` as a failure even on a 2xx HTTP status.
    const ok = res.ok && (body === null || body.success !== false);
    return ok ? { ok: true, data: body as T } : { ok: false, data: null };
  } catch (err) {
    console.error("[webhook] Failed to reach n8n:", err);
    return { ok: false, data: null };
  }
}
