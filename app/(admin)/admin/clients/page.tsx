import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ClientsTable } from "@/components/admin/ClientsTable";
import type { ClientWithRelations } from "@/lib/types";

export const metadata: Metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, meetings(*), interactions(*), quotes(*)")
    .order("created_at", { ascending: false });

  const clients = (data ?? []) as unknown as ClientWithRelations[];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
      <p className="mt-1 text-sm text-slate-500">
        {clients.length} client{clients.length === 1 ? "" : "s"} · click a row for meeting
        &amp; interaction history.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn&apos;t load clients: {error.message}
        </p>
      )}

      <div className="mt-6">
        <ClientsTable clients={clients} />
      </div>
    </div>
  );
}
