import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin/auth";
import { revalidateAllContentPaths } from "@/lib/admin/revalidate";

export async function POST(request: Request) {
  const authorized = await isAdminAuthenticatedFromRequest(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidateAllContentPaths();
  return NextResponse.json({ ok: true });
}
