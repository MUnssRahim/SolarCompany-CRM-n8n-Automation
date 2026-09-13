import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";

export const metadata: Metadata = {
  title: "Solar Calculator",
  description: "Estimate your solar system size, cost, and monthly savings.",
};

export default function CalculatorPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Solar Calculator</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Estimate your potential solar system size, cost, and savings based on your energy
        usage.
      </p>

      <div className="mt-10">
        <CalculatorForm />
      </div>
    </Container>
  );
}
