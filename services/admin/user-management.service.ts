import { usersRepository } from "@/repositories/users.repository"
import type { PlatformUser } from "@/types/platform-user"
import type { UserRole } from "@/types/auth"

export function listPlatformUsers(): PlatformUser[] {
  return usersRepository.listUsers()
}

export function summarizeUsersByRole(users: PlatformUser[]) {
  const counts: Record<UserRole, number> = {
    seeker: 0,
    contributor: 0,
    reviewer: 0,
    admin: 0,
    superAdmin: 0,
  }

  for (const user of users) {
    counts[user.role] += 1
  }

  return counts
}
