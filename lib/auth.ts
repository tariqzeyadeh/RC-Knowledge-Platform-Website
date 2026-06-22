import type { NavGroup } from "@/config/navigation"
import type { SessionUser, UserRole } from "@/types/auth"

export {
  canAccessPath,
  canUpload,
  getPostLoginDestination,
  getRoleLanding,
  isSuperAdmin,
  isSuperAdminPortalPath,
  normalizePath,
} from "@/lib/auth-access"

import {
  canAccessPath,
  canUpload,
  getPostLoginDestination,
  getRoleLanding,
  isSuperAdmin,
  isSuperAdminPortalPath,
  normalizePath,
} from "@/lib/auth-access"

export function filterNavGroups(groups: NavGroup[], role: UserRole): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPath(role, item.href)),
    }))
    .filter((group) => group.items.length > 0)
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
