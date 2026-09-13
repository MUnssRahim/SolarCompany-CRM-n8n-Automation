"use client";

import { Fragment, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Field";
import { ClientStatusBadge, MeetingStatusBadge } from "@/components/ui/Badge";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ClientWithRelations } from "@/lib/types";

type SortKey = "name" | "status" | "created_at";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = ["all", "active", "converted", "inactive"];

function SortableHeader({
  label,
  sortableKey,
  sortKey,
  sortDir,
  onToggle,
}: {
  label: string;
  sortableKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onToggle: (key: SortKey) => void;
}) {
  const active = sortKey === sortableKey;
  return (
    <button
      type="button"
      onClick={() => onToggle(sortableKey)}
      className={cn(
        "flex items-center gap-1 text-xs font-semibold uppercase tracking-wide",
        active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
      {active && <span>{sortDir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

export function ClientsTable({ clients }: { clients: ClientWithRelations[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = clients.filter((c) => {
      const matchesSearch =
        !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "status") cmp = String(a.status).localeCompare(String(b.status));
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [clients, search, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email…"
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
              {s === "all" ? "All Statuses" : s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3">
                <SortableHeader
                  label="Name"
                  sortableKey="name"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onToggle={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Source
              </th>
              <th className="px-4 py-3">
                <SortableHeader
                  label="Status"
                  sortableKey="status"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onToggle={toggleSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortableHeader
                  label="Joined"
                  sortableKey="created_at"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onToggle={toggleSort}
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  No clients match your filters.
                </td>
              </tr>
            )}
            {filtered.map((client) => {
              const isExpanded = expandedId === client.id;
              return (
                <Fragment key={client.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : client.id)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                    <td className="px-4 py-3 text-slate-600">{client.email}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">
                      {String(client.source).replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <ClientStatusBadge status={client.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-slate-50">
                      <td colSpan={5} className="px-4 py-5">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Meeting History
                            </p>
                            {client.meetings.length === 0 ? (
                              <p className="text-sm text-slate-400">No meetings yet.</p>
                            ) : (
                              <ul className="space-y-2">
                                {client.meetings.map((m) => (
                                  <li
                                    key={m.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                                  >
                                    <span className="text-slate-700">
                                      {new Date(`${m.date}T00:00:00`).toLocaleDateString()} · {m.time}
                                    </span>
                                    <MeetingStatusBadge status={m.status} />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Interaction Log
                            </p>
                            {client.interactions.length === 0 ? (
                              <p className="text-sm text-slate-400">No interactions yet.</p>
                            ) : (
                              <ul className="space-y-2">
                                {client.interactions.map((i) => (
                                  <li
                                    key={i.id}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                                  >
                                    <p className="font-medium capitalize text-slate-700">
                                      {String(i.type).replace("_", " ")}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      {new Date(i.created_at).toLocaleString()}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
