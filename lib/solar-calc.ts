// Client-safe solar sizing math used by the calculator page.
// Assumptions: ~4.5 peak sun hours/day average for Pakistan, 550W (0.55kW) panels,
// installed cost of PKR 170,000 per kW, and ~85% of the current bill recovered as savings.

export const PEAK_SUN_HOURS = 4.5;
export const PANEL_WATTAGE_KW = 0.55;
export const COST_PER_KW = 170_000;
export const SAVINGS_RATE = 0.85;

export type CalculatorInputs = {
  monthlyBill: number;
  monthlyKwh: number;
  roofAreaSqft: number;
  city: string;
};

export type CalculatorResults = {
  systemSizeKw: number;
  numPanels: number;
  estimatedCost: number;
  monthlySavings: number;
  paybackYears: number;
  annualSavings: number;
  co2OffsetTonsPerYear: number;
};

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
  "Gujranwala",
  "Sukkur",
] as const;

export function calculateSolarSystem(inputs: CalculatorInputs): CalculatorResults {
  const monthlyKwh = Math.max(0, inputs.monthlyKwh);
  const monthlyBill = Math.max(0, inputs.monthlyBill);

  const systemSizeKw = monthlyKwh / (30 * PEAK_SUN_HOURS);
  const numPanels = Math.ceil(systemSizeKw / PANEL_WATTAGE_KW);
  const estimatedCost = systemSizeKw * COST_PER_KW;
  const monthlySavings = monthlyBill * SAVINGS_RATE;
  const paybackYears =
    monthlySavings > 0 ? estimatedCost / (monthlySavings * 12) : 0;

  return {
    systemSizeKw,
    numPanels,
    estimatedCost,
    monthlySavings,
    paybackYears,
    annualSavings: monthlySavings * 12,
    // ~0.65 kg CO2 offset per kWh generated on Pakistan's grid mix, roughly.
    co2OffsetTonsPerYear: (systemSizeKw * PEAK_SUN_HOURS * 365 * 0.65) / 1000,
  };
}

export function formatPKR(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: digits,
  }).format(value);
}
