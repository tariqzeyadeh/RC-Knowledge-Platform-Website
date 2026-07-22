import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/config/auth"
import { authenticateUser } from "@/lib/auth-credentials"
import { encodeSession } from "@/lib/auth"
import { sessionCookieOptions } from "@/lib/cookie-options"

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string }
  const username = body.username?.trim() ?? ""
  const password = body.password ?? ""

  const user = await authenticateUser(username, password)
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

  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0))

  response.cookies.set(SESSION_COOKIE, session, sessionCookieOptions(60 * 60 * 24 * 7))

  return response
}
