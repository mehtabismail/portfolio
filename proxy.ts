import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionValue } from "@/lib/admin/auth";
import { createSupabaseForProxy } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isValid = await verifyAdminSessionValue(token);
    if (isValid) return NextResponse.next();

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/dashboard")) {
    let response = NextResponse.next({ request });
    try {
      const supabase = createSupabaseForProxy(request, response);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        const login = new URL("/login", request.url);
        login.searchParams.set("next", pathname);
        return NextResponse.redirect(login);
      }
      return response;
    } catch {
      const login = new URL("/login", request.url);
      login.searchParams.set("error", "config");
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
