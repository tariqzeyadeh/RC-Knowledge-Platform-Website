import { eq } from "drizzle-orm"
import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getDb } from "@/lib/db"
import { users } from "@/lib/db/schema"
import {
  deletePlatformUser,
  getPlatformUser,
  updatePlatformUser,
} from "@/lib/db/repositories/user.repository"
import type { UserRole } from "@/types/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(["superAdmin"])
  if (!session) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const user = await getPlatformUser(id, locale)
  if (!user) return errorResponse("not_found", 404)
  return jsonResponse({ user })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(["superAdmin"])
  if (!session) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as {
    displayName?: string
    role?: UserRole
    status?: "active" | "inactive"
    email?: string
    departmentId?: string
  }

  const user = await updatePlatformUser(id, body)
  if (!user) return errorResponse("not_found", 404)
  return jsonResponse({ user })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireSession(["superAdmin"])
  if (!session) return errorResponse("unauthorized", 401)

  const { id } = await params
  const db = getDb()
  const existing = await db.select().from(users).where(eq(users.id, id)).get()
  if (!existing) return errorResponse("not_found", 404)
  if (existing.username === session.username) {
    return errorResponse("cannot_delete_self", 400)
  }

  await deletePlatformUser(id)
  return jsonResponse({ ok: true })
}
