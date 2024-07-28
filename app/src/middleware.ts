import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/"];
const authRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_token");

  if (protectedRoutes.some((route) => request.nextUrl.pathname === route)) {
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (authRoutes.some((route) => request.nextUrl.pathname === route)) {
    if (authCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
