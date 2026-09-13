"use client";

import { useMemo, useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { MeetingStatusBadge } from "@/components/ui/Badge";
import { SearchIcon } from "@/components/ui/icons";
import { cn, formatTimeLabel } from "@/lib/utils";
import { updateMeetingStatus } from "@/lib/actions/meetings";
import type { MeetingStatus, MeetingWithClient } from "@/lib/types";

const STATUS_OPTIONS = ["all", "scheduled", "completed", "no_show", "cancelled"];

const STATUS_ACTIONS: { status: MeetingStatus; label: string }[] = [
  { status: "completed", label: "Completed" },
  { status: "no_show", label: "No-Show" },
  { status: "cancelled", label: "Cancel" },
];

export function MeetingsTable({ meetings }: { meetings: MeetingWithClient[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return meetings
      .filter((m) => statusFilter === "all" || m.status === statusFilter)
      .filter((m) => {
        if (!q) return true;
        const name = m.clients?.name?.toLowerCase() ?? "";
        const email = m.clients?.email?.toLowerCase() ?? "";
        return name.includes(q) || email.includes(q);
      })
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [meetings, search, statusFilter]);

  function handleStatusChange(meetingId: string, status: MeetingStatus) {
    setErrorMsg(null);
    setPendingId(meetingId);
    startTransition(async () => {
      const result = await updateMeetingStatus(meetingId, status);
      if (!result.ok) setErrorMsg(result.error ?? "Failed to update meeting.");
      setPendingId(null);
    });
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by client name or email…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s.replace("_", " ")}
            </option>
          ))}
        </Select>
      </div>

      {errorMsg && (
        <p className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  No meetings match your filters.
                </td>
              </tr>
            )}
            {filtered.map((m) => {
              const rowPending = isPending && pendingId === m.id;
              return (
                <tr key={m.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{m.clients?.name ?? "—"}</p>
                    <p className="text-xs text-slate-500">{m.clients?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(`${m.date}T00:00:00`).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatTimeLabel(m.time)}</td>
                  <td className="px-4 py-3">
                    <MeetingStatusBadge status={m.status} />
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                    {m.notes || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_ACTIONS.map((action) => (
                        <Button
                          key={action.status}
                          variant="outline"
                          size="sm"
                          disabled={rowPending || m.status === action.status}
                          onClick={() => handleStatusChange(m.id, action.status)}
                          className={cn(
                            "px-2.5 py-1 text-xs",
                            m.status === action.status && "border-navy-900 text-navy-900"
                          )}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
