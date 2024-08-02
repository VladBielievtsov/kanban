import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/favicon.ico", "/_next", "/api/auth"];

function isPublicRoute(path: string) {
  return publicRoutes.some((route) => path.startsWith(route));
}

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    if (pathname === "/login" && authCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
