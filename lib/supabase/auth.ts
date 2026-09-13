import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the current authenticated user (or null), memoized per request so
 * the admin layout and page can both call it without doubling the network
 * round-trip to Supabase auth.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
