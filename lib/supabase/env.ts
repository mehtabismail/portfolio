export function getSupabasePublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.trim() || !anonKey?.trim()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY (add them to .env.local).",
    );
  }
  return { url: url.trim(), anonKey: anonKey.trim() };
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key?.trim()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY (server-only; add to .env.local).");
  }
  return key.trim();
}
