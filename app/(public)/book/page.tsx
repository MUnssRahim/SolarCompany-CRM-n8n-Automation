import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Schedule a free consultation with our solar experts.",
};

export default function BookPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Book a Consultation
        </h1>
        <p className="mt-2 text-slate-600">
          Schedule a time with our technical experts to discuss your energy needs and
          explore custom solar solutions.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <BookingFlow />
      </div>
    </Container>
  );
}
