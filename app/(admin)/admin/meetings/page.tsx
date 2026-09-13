import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MeetingsTable } from "@/components/admin/MeetingsTable";
import type { MeetingWithClient } from "@/lib/types";

export const metadata: Metadata = { title: "Meetings" };

export default async function AdminMeetingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meetings")
    .select("*, clients(id, name, email, phone)")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  const meetings = (data ?? []) as unknown as MeetingWithClient[];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meetings</h1>
      <p className="mt-1 text-sm text-slate-500">
        {meetings.length} meeting{meetings.length === 1 ? "" : "s"} · update status as
        consultations happen.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn&apos;t load meetings: {error.message}
        </p>
      )}

      <div className="mt-6">
        <MeetingsTable meetings={meetings} />
      </div>
    </div>
  );
}
