import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin/auth";
import { removeProject } from "@/lib/admin/content-service";

export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
  const authorized = await isAdminAuthenticatedFromRequest(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
  }

  try {
    await removeProject(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
