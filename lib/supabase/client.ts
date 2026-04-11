"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";

/** Browser Supabase client (singleton per module in the browser). */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient(url, anonKey);
}
