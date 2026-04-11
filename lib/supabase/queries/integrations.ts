import type { SupabaseClient } from "@supabase/supabase-js";
import type { IntegrationRow } from "../types";

const INTEGRATION_FIELDS =
  "id, user_id, provider, username, is_active, last_synced_at" as const;

/** Requires a Supabase client with a logged-in user (RLS: own rows only). */
export async function listIntegrationsForCurrentUser(
  client: SupabaseClient,
): Promise<IntegrationRow[]> {
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError || !authData.user) return [];

  const { data, error } = await client
    .from("integrations")
    .select(INTEGRATION_FIELDS)
    .eq("user_id", authData.user.id)
    .order("provider", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as IntegrationRow[];
}
