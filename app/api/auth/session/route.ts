import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/config/auth"
import { decodeSession } from "@/lib/auth"

export async function GET() {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) {
    return NextResponse.json({ user: null })
  }

  const user = decodeSession(raw)
  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user })
}
