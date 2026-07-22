import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  createPlatformUser,
  listPlatformUsers,
} from "@/lib/db/repositories/user.repository"
import type { UserRole } from "@/types/auth"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const locale = getLocaleFromRequest(request)
  const users = await listPlatformUsers(locale)
  return jsonResponse({ users })
}

export async function POST(request: Request) {
  const session = await requireSession(["superAdmin"])
  if (!session) return errorResponse("unauthorized", 401)

  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as {
    username: string
    password: string
    displayName: string
    role: UserRole
    departmentId?: string
    email: string
    status?: "active" | "inactive"
  }

  const id = `U-${Date.now()}`
  const passwordHash = await bcrypt.hash(body.password, 10)
  const created = await createPlatformUser({
    id,
    username: body.username,
    passwordHash,
    displayName: body.displayName,
    role: body.role,
    departmentId: body.departmentId,
    email: body.email,
    status: body.status,
  })

  return jsonResponse({ user: created }, { status: 201 })
}
