import bcrypt from "bcryptjs"
import { findUserByUsername, touchUserLogin } from "@/lib/db/repositories/user.repository"
import type { SessionUser } from "@/types/auth"

export async function authenticateUser(
  username: string,
  password: string,
): Promise<SessionUser | null> {
  const user = await findUserByUsername(username)
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  await touchUserLogin(user.username)

  return {
    username: user.username,
    role: user.role as SessionUser["role"],
    displayName: user.displayName,
  }
}
