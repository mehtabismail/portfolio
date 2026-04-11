import type { SupabaseClient } from "@supabase/supabase-js";
import slugify from "slugify";
import { normalizeSlug, validateSlugFormat } from "@/lib/platform/slug";

function normalizeBase(raw: string): string {
  let s = slugify(raw || "portfolio", { lower: true, strict: true, trim: true });
  s = normalizeSlug(s).replace(/^-+|-+$/g, "");
  if (s.length > 40) s = s.slice(0, 40).replace(/-+$/g, "");
  if (s.length < 2) s = "portfolio";
  let guard = 0;
  while (validateSlugFormat(s) && guard++ < 40) {
    s = slugify(`${raw}-portfolio-${guard}`, { lower: true, strict: true, trim: true }).slice(0, 40).replace(/-+$/g, "");
    if (s.length < 2) s = "portfolio";
  }
  return s;
}

/**
 * Picks `base`, then `base-2`, `base-3`, … until a slug is free in `platform_users`.
 */
export async function allocatePortfolioSlug(admin: SupabaseClient, slugBase: string): Promise<string> {
  const root = normalizeBase(slugBase);

  for (let n = 0; n < 500; n++) {
    const candidate = n === 0 ? root : `${root}-${n + 1}`;
    const fmt = validateSlugFormat(candidate);
    if (fmt) continue;

    const { data, error } = await admin.from("platform_users").select("id").eq("slug", candidate).maybeSingle();
    if (error) throw new Error(error.message);
    if (data === null) return candidate;
  }

  throw new Error("Could not allocate a free portfolio URL.");
}
