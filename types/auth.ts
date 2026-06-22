export type UserRole = "seeker" | "contributor" | "reviewer" | "admin" | "superAdmin"

export type SessionUser = {
  username: string
  role: UserRole
  displayName: string
}

export type DemoUser = SessionUser & {
  password: string
}
