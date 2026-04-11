import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { parseContactPayload, parseSitePayload, parseUserPayload } from "@/lib/admin/schemas";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";

type Key = "user" | "site" | "contact";

type Body = {
  payload?: unknown;
};

export async function POST(request: Request, context: { params: Promise<{ key: string }> }) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { key: rawKey } = await context.params;
  if (rawKey !== "user" && rawKey !== "site" && rawKey !== "contact") {
    return NextResponse.json({ ok: false, error: "Invalid content key" }, { status: 400 });
  }
  const key = rawKey as Key;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { user, profile, admin } = auth;
  const column = key === "user" ? "cms_user" : key === "site" ? "cms_site" : "cms_contact";

  let normalized: unknown;
  try {
    normalized =
      key === "user"
        ? parseUserPayload(body.payload)
        : key === "site"
          ? parseSitePayload(body.payload)
          : parseContactPayload(body.payload);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  const { error } = await admin
    .from("platform_users")
    .update({
      [column]: normalized,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const slug = profile.slug;
  revalidatePath(`/u/${slug}`);
  revalidatePath(`/u/${slug}/work`);
  revalidatePath(`/u/${slug}/about`);
  revalidatePath(`/u/${slug}/contact`);
  revalidatePath(`/dashboard/${slug}`);
  revalidatePath(`/dashboard/${slug}/user`);
  revalidatePath(`/dashboard/${slug}/site`);
  revalidatePath(`/dashboard/${slug}/contact`);

  return NextResponse.json({ ok: true });
}
