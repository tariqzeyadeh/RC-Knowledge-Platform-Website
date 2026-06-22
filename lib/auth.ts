import { ROLE_LANDING } from "@/config/auth"
import type { NavGroup } from "@/config/navigation"
import type { SessionUser, UserRole } from "@/types/auth"

const SUPER_ADMIN_PREFIXES = ["/analytics", "/governance", "/admin"]

const PLATFORM_SHARED_PREFIXES = [
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

export function normalizePath(pathname: string) {
  if (pathname === "/") return "/"
  return pathname.replace(/\/$/, "")
}

export function isSuperAdminPortalPath(pathname: string) {
  const path = normalizePath(pathname)
  return SUPER_ADMIN_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

export function isSuperAdmin(role: UserRole) {
  return role === "superAdmin"
}

function canAccessSharedPlatformPath(role: UserRole, path: string) {
  return PLATFORM_SHARED_PREFIXES.some((prefix) => {
    if (prefix === "/") return path === "/"
    return path === prefix || path.startsWith(`${prefix}/`)
  })
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const path = normalizePath(pathname)

  if (role === "superAdmin") {
    return isSuperAdminPortalPath(path) || path === "/forbidden"
  }

  if (isSuperAdminPortalPath(path)) {
    return false
  }

  if (path === "/review" || path.startsWith("/review/")) {
    return role === "reviewer" || role === "admin"
  }

  if (path === "/upload" || path.startsWith("/upload/")) {
    return role === "contributor" || role === "reviewer" || role === "admin"
  }

  if (path === "/communities/create") {
    return role === "contributor" || role === "reviewer" || role === "admin"
  }

  if (path === "/transfer/schedule") {
    return role === "contributor" || role === "reviewer" || role === "admin"
  }

  return canAccessSharedPlatformPath(role, path)
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
    if (!["seeker", "contributor", "reviewer", "admin", "superAdmin"].includes(parsed.role)) return null
    return parsed
  } catch {
    return null
  }
}

export function getPostLoginDestination(role: UserRole, next?: string | null) {
  if (next && next !== "/login" && canAccessPath(role, next)) {
    return next
  }
  return ROLE_LANDING[role]
}

export function canUpload(role: UserRole) {
  return role === "contributor" || role === "reviewer" || role === "admin"
}
