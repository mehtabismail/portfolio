import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for the root `proxy.ts` (cookie read/write on the outgoing response).
 */
export function createSupabaseForProxy(
  request: NextRequest,
  response: NextResponse,
): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
