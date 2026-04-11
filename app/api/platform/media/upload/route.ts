import { NextResponse } from "next/server";
import { uploadPlatformUserImage } from "@/lib/cloudinary/platform-upload";
import { requirePlatformApiUser } from "@/lib/platform/api-auth";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const auth = await requirePlatformApiUser();
  if (!auth.ok) return auth.response;

  const { profile } = auth;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart form data." }, { status: 400 });
  }

  const portfolioSlugField = form.get("portfolioSlug");
  if (typeof portfolioSlugField !== "string" || portfolioSlugField.trim() !== profile.slug) {
    return NextResponse.json({ ok: false, error: "Invalid portfolio slug." }, { status: 403 });
  }

  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: "Missing file." }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: "Unsupported image type." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be 4MB or smaller." }, { status: 400 });
  }

  const labelField = form.get("label");
  const label =
    typeof labelField === "string" && labelField.trim().length ? labelField.trim().slice(0, 80) : "upload";

  const safeLabel = label.replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  const assetKey = `media/${Date.now()}-${safeLabel}`;

  try {
    const url = await uploadPlatformUserImage(buffer, profile.slug, assetKey);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
