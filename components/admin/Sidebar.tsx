"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { SunIcon, GridIcon, UsersIcon, CalendarIcon, BotIcon, LogOutIcon } from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: GridIcon, exact: true },
  { href: "/admin/clients", label: "Clients", icon: UsersIcon, exact: false },
  { href: "/admin/meetings", label: "Meetings", icon: CalendarIcon, exact: false },
  { href: "/admin/agents", label: "Agents", icon: BotIcon, exact: false },
];

export function Sidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-navy-950 px-4 py-6 text-slate-300">
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-brand-400">
          <SunIcon className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Solaris Admin</p>
          <p className="truncate text-xs text-slate-500">{userEmail ?? "Technical Operations"}</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-white/5"
      >
        <LogOutIcon className="h-4.5 w-4.5" />
        Logout
      </button>
    </aside>
  );
}
