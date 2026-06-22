import { ROLE_LANDING } from "@/config/auth"
import type { UserRole } from "@/types/auth"

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

function canAccessSharedPlatformPath(path: string) {
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

  return canAccessSharedPlatformPath(path)
}

export function getRoleLanding(role: UserRole) {
  return ROLE_LANDING[role]
}

const BLOCKED_LOGIN_DESTINATIONS = new Set(["/login", "/forbidden"])

export function getPostLoginDestination(role: UserRole, next?: string | null) {
  const landing = ROLE_LANDING[role]

  if (!next || BLOCKED_LOGIN_DESTINATIONS.has(next)) {
    return landing
  }

  const path = next.startsWith("/") ? next : `/${next}`

  if (canAccessPath(role, path)) {
    return path
  }

  return landing
}

export function canUpload(role: UserRole) {
  return role === "contributor" || role === "reviewer" || role === "admin"
}
