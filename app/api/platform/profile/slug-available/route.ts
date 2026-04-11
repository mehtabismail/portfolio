import { NextResponse } from "next/server";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";
import { normalizeSlug, validateSlugFormat } from "@/lib/platform/slug";

/** Authenticated: true if slug is free or still owned by the current user. */
export async function GET(request: Request) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const slug = normalizeSlug(searchParams.get("slug") ?? "");
  const formatError = validateSlugFormat(slug);
  if (formatError) {
    return NextResponse.json({ ok: false, available: false, error: formatError }, { status: 400 });
  }

  const { user, admin } = auth;
  const { data, error } = await admin.from("platform_users").select("id").eq("slug", slug).maybeSingle();
  if (error) {
    return NextResponse.json({ ok: false, available: false, error: error.message }, { status: 500 });
  }
  const available = !data || data.id === user.id;
  return NextResponse.json({ ok: true, available });
}
