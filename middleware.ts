import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/config/auth"
import { canAccessPath, decodeSession } from "@/lib/auth"

const PUBLIC_PATHS = ["/login", "/forbidden"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const sessionRaw = request.cookies.get(SESSION_COOKIE)?.value
  const user = sessionRaw ? decodeSession(sessionRaw) : null

  // Always allow login and forbidden pages — login must stay reachable to switch accounts
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user.role === "superAdmin" && pathname === "/") {
    return NextResponse.redirect(new URL("/analytics", request.url))
  }

  if (!canAccessPath(user.role, pathname)) {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
