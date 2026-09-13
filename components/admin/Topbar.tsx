"use client";

import { usePathname } from "next/navigation";
import { BellIcon, HelpCircleIcon, SearchIcon } from "@/components/ui/icons";

const TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/clients": "Clients",
  "/admin/meetings": "Meetings",
  "/admin/agents": "Automation Agents",
};

export function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Solaris Admin";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <SearchIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search…"
            className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <BellIcon className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Help"
        >
          <HelpCircleIcon className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}
