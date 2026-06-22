import { NextResponse } from "next/server"
import { findDemoUser, SESSION_COOKIE } from "@/config/auth"
import { encodeSession } from "@/lib/auth"

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string }
  const username = body.username?.trim() ?? ""
  const password = body.password ?? ""

  const user = findDemoUser(username, password)
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
  }

  const session = encodeSession({
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  })

  const response = NextResponse.json({
    user: {
      username: user.username,
      role: user.role,
      displayName: user.displayName,
    },
  })

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  response.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
