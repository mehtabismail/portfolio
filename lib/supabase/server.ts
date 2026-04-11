import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "./env";

/**
 * Supabase client bound to the current request cookies (Server Components, Route Handlers).
 * Refreshes the session when the auth cookie is present.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const { url, anonKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* set() not allowed in some Server Component contexts */
        }
      },
    },
  });
}

/**
 * Anonymous Supabase client (no user session). Use for public ISR pages under RLS.
 */
export function createSupabasePublicClient(): SupabaseClient {
  const { url, anonKey } = getSupabasePublicEnv();
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Service role client — **server-only**, never import from client components or public routes.
 */
export function createSupabaseServiceRoleClient(): SupabaseClient {
  const { url } = getSupabasePublicEnv();
  return createClient(url, getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
