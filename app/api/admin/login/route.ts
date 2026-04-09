import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionValue, getSessionTtlSeconds, validateAdminSecret } from "@/lib/admin/auth";

type LoginBody = {
  secret?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginBody;

  if (!body.secret || !validateAdminSecret(body.secret)) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const sessionValue = await createAdminSessionValue();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionTtlSeconds(),
  });
  return response;
}
