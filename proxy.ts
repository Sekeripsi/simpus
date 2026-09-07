import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"]

const SESSION_COOKIE = process.env.AUTH_SESSION_COOKIE_NAME || "auth_session"

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.has(SESSION_COOKIE) || request.cookies.has("auth-token")
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root redirect
  if (pathname === "/") {
    if (!isAuthenticated(request)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.redirect(new URL("/home", request.url))
  }

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Redirect to login if not authenticated and not on a public route
  if (!isAuthenticated(request) && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to home if authenticated and on a public route
  if (isAuthenticated(request) && isPublic) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
