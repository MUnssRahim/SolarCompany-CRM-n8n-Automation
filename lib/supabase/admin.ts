import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS — server-only, never import
 * this from a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the
 * browser. Used for privileged admin-dashboard aggregates and the
 * public-form backup inserts that must succeed regardless of RLS policy.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
