import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin/auth";
import { saveProject } from "@/lib/admin/content-service";

type Body = {
  payload?: unknown;
};

export async function POST(request: Request) {
  const authorized = await isAdminAuthenticatedFromRequest(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Body;
    await saveProject(body.payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save project";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
