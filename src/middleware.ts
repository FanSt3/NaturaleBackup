import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    // Verify token
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "your-fallback-secret-key")
    );
    return NextResponse.next();
  } catch (error) {
    // If token is invalid or expired, redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}; 