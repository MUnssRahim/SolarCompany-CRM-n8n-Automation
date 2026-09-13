import { getAuthUser } from "@/lib/supabase/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  // Unauthenticated: only /admin itself can render here (sub-routes are
  // redirected to /admin by middleware before they reach this layout), and
  // it renders its own full-screen login form — no shell chrome.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userEmail={user.email ?? null} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
