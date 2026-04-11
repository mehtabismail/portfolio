import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedPlatformUser } from "@/lib/supabase/queries/users";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PlatformUserRow } from "@/lib/supabase/types";

export type DashboardContext = {
  supabase: SupabaseClient;
  user: User;
  profile: PlatformUserRow;
};

export const getDashboardContext = cache(
  async (expectedSlug: string): Promise<{ ok: true; ctx: DashboardContext } | { ok: false; redirectTo: string }> => {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        ok: false,
        redirectTo: `/login?next=${encodeURIComponent(`/dashboard/${expectedSlug}`)}`,
      };
    }

    const profile = await getAuthenticatedPlatformUser(supabase);
    if (!profile) {
      return { ok: false, redirectTo: "/create" };
    }
    if (profile.slug !== expectedSlug) {
      return { ok: false, redirectTo: `/dashboard/${profile.slug}` };
    }

    return { ok: true, ctx: { supabase, user, profile } };
  },
);

export async function requireDashboard(expectedSlug: string): Promise<DashboardContext> {
  const result = await getDashboardContext(expectedSlug);
  if (!result.ok) {
    redirect(result.redirectTo);
  }
  return result.ctx;
}
