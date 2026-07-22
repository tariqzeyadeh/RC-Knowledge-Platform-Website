import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/config/auth"
import { sessionCookieOptions } from "@/lib/cookie-options"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0))
  return response
}
