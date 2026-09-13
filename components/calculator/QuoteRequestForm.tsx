"use client";

import { useState, type FormEvent } from "react";
import { postToWebhook } from "@/lib/webhook";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { CheckIcon, CoinIcon, GaugeIcon, GridIcon, TrendingUpIcon } from "@/components/ui/icons";
import { StatCard } from "@/components/calculator/StatCard";
import { formatNumber, formatPKR, type CalculatorInputs } from "@/lib/solar-calc";

type N8nQuote = {
  system_size_kw: number;
  num_panels: number;
  estimated_cost: number;
  monthly_savings: number;
  payback_years: number;
};

export function QuoteRequestForm({
  inputs,
  onClose,
}: {
  inputs: CalculatorInputs;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [quote, setQuote] = useState<N8nQuote | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    // Exact payload shape the n8n "Quote Generation" webhook expects.
    const result = await postToWebhook<{ success: boolean; quote: N8nQuote }>(
      process.env.NEXT_PUBLIC_N8N_QUOTE_WEBHOOK,
      {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        monthly_bill: inputs.monthlyBill,
        usage_kwh: inputs.monthlyKwh,
        roof_area: inputs.roofAreaSqft,
        city: inputs.city,
      }
    );

    if (result.ok && result.data.quote) {
      setQuote(result.data.quote);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  if (status === "success" && quote) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Your detailed quote is ready</p>
            <p className="mt-0.5 text-sm text-slate-600">
              We&apos;ve also emailed a full breakdown to you.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <StatCard
            icon={<GaugeIcon />}
            label="System Size"
            value={`${formatNumber(quote.system_size_kw)} kW`}
          />
          <StatCard icon={<GridIcon />} label="Panels" value={String(quote.num_panels)} />
          <StatCard
            icon={<CoinIcon />}
            label="Estimated Cost"
            value={formatPKR(quote.estimated_cost)}
          />
          <StatCard
            icon={<TrendingUpIcon />}
            label="Monthly Savings"
            value={formatPKR(quote.monthly_savings)}
            helper={`${formatNumber(quote.payback_years)}-year payback`}
            tone="emerald"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">Get your detailed quote</p>
      <p className="mt-1 text-xs text-slate-500">
        Share your details and we&apos;ll email a firm, itemized breakdown.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="quote-name">Full Name</Label>
          <Input id="quote-name" name="name" placeholder="Jane Doe" required />
        </div>
        <div>
          <Label htmlFor="quote-email">Email Address</Label>
          <Input
            id="quote-email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="quote-phone">Phone Number</Label>
          <Input
            id="quote-phone"
            name="phone"
            type="tel"
            placeholder="+923001234567"
            required
          />
        </div>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-red-600">
          Couldn&apos;t send your request. Please try again.
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button type="submit" variant="secondary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request Quote"}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
