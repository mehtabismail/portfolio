import { createSupabaseServerClient } from "@/lib/supabase/server";

/** When the signed-in user owns this portfolio, show a Dashboard entry in public nav overlays. */
export async function getTenantDashboardPrepend(
  slug: string,
  portfolioOwnerId: string,
): Promise<{ href: string; label: string }[] | undefined> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== portfolioOwnerId) return undefined;
  return [{ href: `/dashboard/${slug}`, label: "Dashboard" }];
}
