"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { postToWebhook } from "@/lib/webhook";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { CheckIcon } from "@/components/ui/icons";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    // Exact payload shape the n8n "Lead Capture" webhook expects.
    const webhookResult = await postToWebhook(process.env.NEXT_PUBLIC_N8N_LEAD_WEBHOOK, {
      name,
      email,
      phone,
      message,
    });

    // Backup write straight to Supabase so the lead is never lost even if
    // the n8n workflow is down or not configured yet. The id is generated
    // client-side (rather than read back via .select()) because the public
    // insert policy intentionally doesn't grant anon any SELECT rights on
    // client PII.
    let dbOk = false;
    try {
      const supabase = createClient();
      const clientId = crypto.randomUUID();
      const { error } = await supabase.from("clients").insert({
        id: clientId,
        name,
        email,
        phone: phone || null,
        source: "contact_form",
        status: "active",
      });

      if (!error) {
        dbOk = true;
        await supabase.from("interactions").insert({
          client_id: clientId,
          type: "form_submit",
          details: message ? { message } : null,
        });
      }
    } catch (err) {
      console.error("[contact-form] Supabase insert failed:", err);
    }

    setStatus(webhookResult.ok || dbOk ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="text-lg font-semibold text-slate-900">Thanks — message sent!</p>
        <p className="max-w-sm text-sm text-slate-600">
          A member of our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="Jane Doe" required />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="jane@company.com" required />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
      </div>
      <div>
        <Label htmlFor="message">How can we help?</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your property and energy goals…"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-red-600">
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
