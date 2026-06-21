import { ROLE_LANDING } from "@/config/auth"
import type { NavGroup } from "@/config/navigation"
import type { SessionUser, UserRole } from "@/types/auth"

const ADMIN_PREFIXES = ["/analytics", "/governance", "/admin"]

export function normalizePath(pathname: string) {
  if (pathname === "/") return "/"
  return pathname.replace(/\/$/, "")
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (role === "admin") return true

  const path = normalizePath(pathname)

  if (ADMIN_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return false
  }

  if (path === "/review" || path.startsWith("/review/")) {
    return role === "reviewer"
  }

  if (path === "/upload" || path.startsWith("/upload/")) {
    return role === "contributor" || role === "reviewer"
  }

  if (path === "/communities/create") {
    return role === "contributor" || role === "reviewer"
  }

  if (path === "/transfer/schedule") {
    return role === "contributor" || role === "reviewer"
  }

  const sharedPrefixes = [
    "/",
    "/search",
    "/library",
    "/knowledge",
    "/communities",
    "/transfer",
    "/needs",
    "/training",
    "/features",
    "/notifications",
    "/forbidden",
  ]

  return sharedPrefixes.some((prefix) => {
    if (prefix === "/") return path === "/"
    return path === prefix || path.startsWith(`${prefix}/`)
  })
}

export function filterNavGroups(groups: NavGroup[], role: UserRole): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPath(role, item.href)),
    }))
    .filter((group) => group.items.length > 0)
}

export function getRoleLanding(role: UserRole) {
  return ROLE_LANDING[role]
}

export function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user)).toString("base64url")
}

export function decodeSession(value: string): SessionUser | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionUser
    if (!parsed?.username || !parsed?.role || !parsed?.displayName) return null
    if (!["seeker", "contributor", "reviewer", "admin"].includes(parsed.role)) return null
    return parsed
  } catch {
    return null
  }
}

export function canUpload(role: UserRole) {
  return role === "contributor" || role === "reviewer" || role === "admin"
}
