import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/LoginForm";
import { StatCard } from "@/components/admin/StatCard";
import { LeadTrendChart, type MonthlyCount } from "@/components/admin/LeadTrendChart";
import { RecentActivity, type ActivityItem } from "@/components/admin/RecentActivity";
import { Card } from "@/components/ui/Card";
import { toISODate } from "@/lib/utils";
import {
  CalendarCheckIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
} from "@/components/ui/icons";

// Stats are read straight from Supabase (not the n8n dashboard-data
// webhook) — that webhook just has n8n read the same tables and is
// consistently ~7-8s to respond, with no data it doesn't already have here.

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function percentChange(current: number, previous: number): number | undefined {
  if (previous === 0) return current > 0 ? 100 : undefined;
  return Math.round(((current - previous) / previous) * 100);
}

function monthRange(monthsAgo: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
  return { start, end };
}

export default async function AdminDashboardPage() {
  const user = await getAuthUser();
  if (!user) return <LoginForm />;

  const supabase = await createClient();

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 7);
  const prevWeekStart = addDays(weekStart, -7);
  const thisMonth = monthRange(0);
  const lastMonth = monthRange(1);
  const sixMonthsAgo = monthRange(5).start;

  const [
    totalClientsRes,
    inactiveClientsRes,
    quotesTotalRes,
    quotesThisMonthRes,
    quotesLastMonthRes,
    clientsThisMonthRes,
    clientsLastMonthRes,
    meetingsThisWeekRes,
    meetingsLastWeekRes,
    recentClientsRes,
    recentInteractionsRes,
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("status", "inactive"),
    supabase.from("quotes").select("*", { count: "exact", head: true }),
    supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonth.start.toISOString()),
    supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth.start.toISOString())
      .lt("created_at", lastMonth.end.toISOString()),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonth.start.toISOString()),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth.start.toISOString())
      .lt("created_at", lastMonth.end.toISOString()),
    supabase
      .from("meetings")
      .select("*", { count: "exact", head: true })
      .gte("date", toISODate(weekStart))
      .lt("date", toISODate(weekEnd)),
    supabase
      .from("meetings")
      .select("*", { count: "exact", head: true })
      .gte("date", toISODate(prevWeekStart))
      .lt("date", toISODate(weekStart)),
    supabase
      .from("clients")
      .select("id, created_at")
      .gte("created_at", sixMonthsAgo.toISOString()),
    supabase
      .from("interactions")
      .select("id, type, created_at, details, clients(name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalClients = totalClientsRes.count ?? 0;
  const inactiveClients = inactiveClientsRes.count ?? 0;
  const activeClients = Math.max(0, totalClients - inactiveClients);
  const quotesTotal = quotesTotalRes.count ?? 0;
  const meetingsThisWeek = meetingsThisWeekRes.count ?? 0;

  const clientsTrend = percentChange(
    clientsThisMonthRes.count ?? 0,
    clientsLastMonthRes.count ?? 0
  );
  const meetingsTrend = percentChange(meetingsThisWeek, meetingsLastWeekRes.count ?? 0);
  const quotesTrend = percentChange(
    quotesThisMonthRes.count ?? 0,
    quotesLastMonthRes.count ?? 0
  );

  const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  const bucketMonths = Array.from(
    { length: 6 },
    (_, i) => new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
  );
  const countsByMonth = new Map<string, number>();
  for (const row of recentClientsRes.data ?? []) {
    const key = monthKey(new Date(row.created_at as string));
    countsByMonth.set(key, (countsByMonth.get(key) ?? 0) + 1);
  }
  const monthBuckets: MonthlyCount[] = bucketMonths.map((d) => ({
    label: d.toLocaleDateString("en-US", { month: "short" }),
    count: countsByMonth.get(monthKey(d)) ?? 0,
  }));

  const activity: ActivityItem[] = (recentInteractionsRes.data ?? []).map((row) => {
    const client = row.clients as unknown as { name: string } | { name: string }[] | null;
    const name = Array.isArray(client) ? client[0]?.name : client?.name;
    return {
      id: row.id as string,
      type: row.type as string,
      clientName: name ?? "Unknown client",
      createdAt: row.created_at as string,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Real-time metrics and system activity.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<UsersIcon />}
          label="Total Clients"
          value={totalClients.toLocaleString()}
          trend={clientsTrend}
        />
        <StatCard
          icon={<CalendarCheckIcon />}
          label="Meetings This Week"
          value={meetingsThisWeek.toLocaleString()}
          trend={meetingsTrend}
        />
        <StatCard
          icon={<TrendingUpIcon />}
          label={`Active Clients (${inactiveClients} inactive)`}
          value={activeClients.toLocaleString()}
        />
        <StatCard
          icon={<FileTextIcon />}
          label="Quotes Generated"
          value={quotesTotal.toLocaleString()}
          trend={quotesTrend}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900">Lead Generation Trend</p>
          <p className="text-xs text-slate-400">Last 6 months</p>
          <div className="mt-4">
            <LeadTrendChart data={monthBuckets} />
          </div>
        </Card>
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}
