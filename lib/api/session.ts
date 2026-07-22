import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/config/auth"
import { decodeSession } from "@/lib/auth"
import type { SessionUser, UserRole } from "@/types/auth"

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get(SESSION_COOKIE)?.value
  if (!value) return null
  return decodeSession(value)
}

export async function requireSession(allowedRoles?: UserRole[]) {
  const user = await getSessionUser()
  if (!user) return null
  if (allowedRoles && !allowedRoles.includes(user.role)) return null
  return user
}
