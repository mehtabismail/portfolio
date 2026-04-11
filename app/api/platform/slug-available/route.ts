import { NextResponse } from "next/server";
import { normalizeSlug, validateSlugFormat } from "@/lib/platform/slug";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("slug") ?? "";
  const slug = normalizeSlug(raw);
  const formatError = validateSlugFormat(slug);
  if (formatError) {
    return NextResponse.json({ ok: false, available: false, error: formatError }, { status: 400 });
  }

  try {
    const admin = createSupabaseServiceRoleClient();
    const { data, error } = await admin.from("platform_users").select("id").eq("slug", slug).maybeSingle();
    if (error) {
      return NextResponse.json({ ok: false, available: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, available: data === null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, available: false, error: message }, { status: 500 });
  }
}
