import type { UserRole } from "@/types/auth"

export type PlatformUserStatus = "active" | "inactive"

export type PlatformUser = {
  id: string
  username: string
  displayName: string
  role: UserRole
  department: string
  email: string
  status: PlatformUserStatus
  lastLogin: string
}
