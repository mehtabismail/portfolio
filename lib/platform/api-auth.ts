import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedPlatformUser } from "@/lib/supabase/queries/users";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { PlatformUserRow } from "@/lib/supabase/types";

export type PlatformApiAuthOk = {
  ok: true;
  user: User;
  profile: PlatformUserRow;
  admin: SupabaseClient;
};

export type PlatformApiAuthFail = {
  ok: false;
  response: NextResponse;
};

export async function requirePlatformApiUser(): Promise<PlatformApiAuthOk | PlatformApiAuthFail> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  const profile = await getAuthenticatedPlatformUser(supabase);
  if (!profile) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "Complete portfolio setup first." }, { status: 403 }),
    };
  }

  let admin: SupabaseClient;
  try {
    admin = createSupabaseServiceRoleClient();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server misconfiguration";
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: message }, { status: 500 }),
    };
  }

  return { ok: true, user, profile, admin };
}
