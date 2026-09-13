"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { Calendar } from "@/components/booking/Calendar";
import { TimeSlotGrid } from "@/components/booking/TimeSlotGrid";
import { postToWebhook } from "@/lib/webhook";
import { formatDateLabel, formatTimeLabel, nextWeekdays } from "@/lib/utils";
import { CalendarIcon, CheckIcon, MailIcon, PhoneIcon, UsersIcon } from "@/components/ui/icons";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingFlow() {
  const validDates = useMemo(() => nextWeekdays(30), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const notes = String(form.get("notes") ?? "").trim();

    // Exact payload shape the n8n "Meeting Booking" webhook expects. n8n
    // owns persistence end-to-end here (upserts the client, schedules the
    // meeting, logs the interaction) — no direct Supabase write from the
    // client, since that would risk a duplicate client record alongside
    // n8n's upsert.
    const result = await postToWebhook<{ success: boolean; meeting_id: string }>(
      process.env.NEXT_PUBLIC_N8N_MEETING_WEBHOOK,
      { name, email, phone, date: selectedDate, time: selectedTime, notes }
    );

    setStatus(result.ok ? "success" : "error");
  }

  if (status === "success" && selectedDate && selectedTime) {
    return (
      <Card className="mx-auto max-w-xl border-emerald-200 bg-emerald-50 p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-900">You&apos;re booked!</h2>
        <p className="mt-2 text-slate-600">
          {formatDateLabel(selectedDate)} at {formatTimeLabel(selectedTime)}
        </p>
        <p className="mt-4 text-sm text-slate-500">
          A confirmation has been sent to your email. We look forward to speaking with you.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <p className="mb-4 text-sm font-semibold text-slate-900">Select Date</p>
            <Calendar
              validDates={validDates}
              selected={selectedDate}
              onSelect={(iso) => {
                setSelectedDate(iso);
                setStatus("idle");
              }}
            />
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-slate-900">Available Times</p>
            <TimeSlotGrid
              disabled={!selectedDate}
              selected={selectedTime}
              onSelect={(time) => {
                setSelectedTime(time);
                setStatus("idle");
              }}
            />
            {!selectedDate && (
              <p className="mt-2 text-xs text-slate-400">Pick a date to see time slots.</p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-slate-900">Your Details</p>
          <div className="mb-5 flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarIcon className="h-4 w-4 text-brand-500" />
            {selectedDate ? (
              <span>
                {formatDateLabel(selectedDate)}
                {selectedTime ? ` at ${formatTimeLabel(selectedTime)}` : ""}
              </span>
            ) : (
              <span>Choose a date & time to continue</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UsersIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <Input id="name" name="name" className="pl-9" placeholder="Jane Doe" required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-9"
                  placeholder="jane@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <PhoneIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="pl-9"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Anything you'd like us to know beforehand?"
              />
            </div>

            {status === "error" && (
              <p className="text-sm font-medium text-red-600">
                Couldn&apos;t confirm your booking. Please try again.
              </p>
            )}

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={!selectedDate || !selectedTime || status === "submitting"}
            >
              {status === "submitting" ? "Booking…" : "Confirm Booking →"}
            </Button>
            <p className="text-center text-xs text-slate-400">
              By booking, you agree to our Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </Card>
  );
}
