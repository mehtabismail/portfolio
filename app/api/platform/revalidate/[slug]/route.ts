import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: row, error } = await supabase.from("platform_users").select("slug").eq("id", user.id).maybeSingle();
  if (error || !row || row.slug !== slug) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  revalidatePath(`/u/${slug}`);
  revalidatePath(`/u/${slug}/work`);
  revalidatePath(`/u/${slug}/about`);
  revalidatePath(`/u/${slug}/contact`);
  revalidatePath(`/u/${slug}/archive`);
  return NextResponse.json({ ok: true });
}
