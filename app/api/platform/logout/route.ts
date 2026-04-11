import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const { url: supabaseUrl, anonKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/", url.origin), 303);

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.signOut();
  return response;
}
