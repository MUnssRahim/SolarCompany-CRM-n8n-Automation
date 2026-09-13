"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { IconTile } from "@/components/ui/IconTile";
import { StatCard } from "@/components/calculator/StatCard";
import { QuoteRequestForm } from "@/components/calculator/QuoteRequestForm";
import {
  BoltIcon,
  CoinIcon,
  GaugeIcon,
  GridIcon,
  MapPinIcon,
  RulerIcon,
  TrendingUpIcon,
} from "@/components/ui/icons";
import {
  calculateSolarSystem,
  formatNumber,
  formatPKR,
  PANEL_WATTAGE_KW,
  PAKISTAN_CITIES,
  SAVINGS_RATE,
  type CalculatorInputs,
} from "@/lib/solar-calc";

const DEFAULT_INPUTS: CalculatorInputs = {
  monthlyBill: 0,
  monthlyKwh: 0,
  roofAreaSqft: 0,
  city: "",
};

// Rough visual ceiling for the "system size" progress bar — most residential
// systems in this calculator's range fall well under 15 kW.
const SYSTEM_SIZE_VISUAL_MAX_KW = 15;

export function CalculatorForm() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const results = useMemo(() => calculateSolarSystem(inputs), [inputs]);

  function update<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    setShowQuoteForm(false);
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasCalculated(true);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      {/* Inputs */}
      <Card className="border-slate-200 bg-slate-50">
        <CardHeader className="flex flex-row items-center gap-2.5">
          <BoltIcon className="h-5 w-5 text-brand-500" />
          <h2 className="text-base font-semibold text-slate-900">System Requirements</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="monthlyBill">Average Monthly Bill (PKR)</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-400">
                  Rs
                </span>
                <Input
                  id="monthlyBill"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="e.g. 25000"
                  className="pl-9"
                  value={inputs.monthlyBill || ""}
                  onChange={(e) => update("monthlyBill", Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="monthlyKwh">Average Monthly Usage (kWh)</Label>
              <div className="relative">
                <BoltIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <Input
                  id="monthlyKwh"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="e.g. 450"
                  className="pl-9"
                  value={inputs.monthlyKwh || ""}
                  onChange={(e) => update("monthlyKwh", Number(e.target.value))}
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Found on your electricity bill.</p>
            </div>

            <div>
              <Label htmlFor="roofArea">Available Roof Area (sq ft)</Label>
              <div className="relative">
                <RulerIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <Input
                  id="roofArea"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="e.g. 500"
                  className="pl-9"
                  value={inputs.roofAreaSqft || ""}
                  onChange={(e) => update("roofAreaSqft", Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <div className="relative">
                <MapPinIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <Select
                  id="city"
                  className="pl-9"
                  value={inputs.city}
                  onChange={(e) => update("city", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  {PAKISTAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Calculate System
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Estimated Results</h2>

        {!hasCalculated ? (
          <Card className="border-dashed border-slate-300 bg-white p-10 text-center">
            <IconTile tone="navy" className="mx-auto">
              <GaugeIcon />
            </IconTile>
            <p className="mt-4 text-sm font-medium text-slate-700">
              Fill in the form and calculate to see your custom system size, cost, and
              savings.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<GaugeIcon />}
                label="Recommended System Size"
                value={`${formatNumber(results.systemSizeKw)} kW`}
                progress={(results.systemSizeKw / SYSTEM_SIZE_VISUAL_MAX_KW) * 100}
              />
              <StatCard
                icon={<GridIcon />}
                label="Est. Number of Panels"
                value={String(results.numPanels)}
                helper={`Based on ${Math.round(PANEL_WATTAGE_KW * 1000)}W Tier-1 panels`}
              />
              <StatCard
                icon={<CoinIcon />}
                label="Estimated Cost"
                value={formatPKR(results.estimatedCost)}
                helper="Includes installation & standard inverter"
              />
              <StatCard
                icon={<TrendingUpIcon />}
                label="Est. Monthly Savings"
                value={formatPKR(results.monthlySavings)}
                helper={`~${Math.round(SAVINGS_RATE * 100)}% bill reduction`}
                tone="emerald"
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              These are estimates based on average solar irradiance and a{" "}
              {formatNumber(results.paybackYears)}-year simple payback. For a precise
              engineering layout and firm pricing, request a quote.
            </p>

            <div className="mt-4">
              {showQuoteForm ? (
                <QuoteRequestForm inputs={inputs} onClose={() => setShowQuoteForm(false)} />
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => setShowQuoteForm(true)}
                >
                  Get Your Detailed Quote
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
