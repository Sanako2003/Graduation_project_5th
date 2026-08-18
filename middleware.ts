import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ما بنحمي الصفحات العامة
  const publicPaths = ["/login", "/register", "/about", "/contact"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // نجيب الـ user من الـ cookie (لازم تحطه وقت الـ login)
  const userCookie = request.cookies.get("user")?.value;

  if (!userCookie) {
    // مش مسجل دخول → روح على login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let user: { role?: string } = {};
  try {
    user = JSON.parse(decodeURIComponent(userCookie));
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.role;

  // إذا حاول يدخل على صفحة مش إلو
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (pathname.startsWith("/admin_profial") && role !== "instructor") {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (pathname.startsWith("/profile") && role !== "student") {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return NextResponse.next();
}

function getRoleHome(role?: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "instructor":
      return "/admin_profial";
    default:
      return "/profile";
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin_profial/:path*",
    "/profile/:path*",
    "/courses/:path*",
    "/Assessment/:path*",
  ],
};
