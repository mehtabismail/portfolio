import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin/auth";
import { saveSingletonContent } from "@/lib/admin/content-service";
import type { AdminSingletonKey } from "@/lib/admin/types";

type Body = {
  payload?: unknown;
};

export async function POST(request: Request, context: { params: Promise<{ key: string }> }) {
  const authorized = await isAdminAuthenticatedFromRequest(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await context.params;
  if (key !== "user" && key !== "site" && key !== "contact") {
    return NextResponse.json({ ok: false, error: "Invalid content key" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Body;
    await saveSingletonContent(key as AdminSingletonKey, body.payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save content";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
