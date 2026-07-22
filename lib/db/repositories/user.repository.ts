import { eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { getLookupLabel } from "@/lib/db/repositories/lookup.repository"
import type { Locale } from "@/i18n"
import type { UserRole } from "@/types/auth"
import type { PlatformUser } from "@/types/platform-user"

function formatLastLogin(value: string | null | undefined) {
  if (!value) return "—"
  return value.replace("T", " ").slice(0, 16)
}

export async function findUserByUsername(username: string) {
  const db = getDb()
  return db.select().from(users).where(eq(users.username, username.trim().toLowerCase())).get()
}

export async function listPlatformUsers(locale: Locale = "ar"): Promise<PlatformUser[]> {
  const db = getDb()
  const rows = await db.select().from(users).orderBy(users.displayName)

  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      username: row.username,
      displayName: row.displayName,
      role: row.role as UserRole,
      department: row.departmentId
        ? await getLookupLabel("department", row.departmentId, locale)
        : "—",
      email: row.email,
      status: row.status as PlatformUser["status"],
      lastLogin: formatLastLogin(row.lastLoginAt),
    })),
  )
}

export async function getPlatformUser(id: string, locale: Locale = "ar") {
  const db = getDb()
  const row = await db.select().from(users).where(eq(users.id, id)).get()
  if (!row) return null

  return {
    id: row.id,
    username: row.username,
    displayName: row.displayName,
    role: row.role as UserRole,
    department: row.departmentId
      ? await getLookupLabel("department", row.departmentId, locale)
      : "—",
    email: row.email,
    status: row.status as PlatformUser["status"],
    lastLogin: formatLastLogin(row.lastLoginAt),
  } satisfies PlatformUser
}

export async function updatePlatformUser(
  id: string,
  data: Partial<Pick<PlatformUser, "displayName" | "role" | "status" | "email">> & {
    departmentId?: string
  },
) {
  const db = getDb()
  await db
    .update(users)
    .set({
      displayName: data.displayName,
      role: data.role,
      status: data.status,
      email: data.email,
      departmentId: data.departmentId,
    })
    .where(eq(users.id, id))

  return getPlatformUser(id)
}

export async function deletePlatformUser(id: string) {
  const db = getDb()
  await db.delete(users).where(eq(users.id, id))
}

export async function createPlatformUser(data: {
  id: string
  username: string
  passwordHash: string
  displayName: string
  role: UserRole
  departmentId?: string
  email: string
  status?: PlatformUser["status"]
}) {
  const db = getDb()
  const now = new Date().toISOString()

  await db.insert(users).values({
    id: data.id,
    username: data.username.trim().toLowerCase(),
    passwordHash: data.passwordHash,
    displayName: data.displayName,
    role: data.role,
    departmentId: data.departmentId,
    email: data.email,
    status: data.status ?? "active",
    createdAt: now,
  })

  return getPlatformUser(data.id)
}

export async function touchUserLogin(username: string) {
  const db = getDb()
  const now = new Date().toISOString()
  await db.update(users).set({ lastLoginAt: now }).where(eq(users.username, username))
}
