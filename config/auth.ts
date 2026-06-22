import type { DemoUser, UserRole } from "@/types/auth"

export const SESSION_COOKIE = "rc_session"

/** Demo accounts — prototype only, not for production */
export const DEMO_USERS: DemoUser[] = [
  {
    username: "seeker",
    password: "seeker123",
    role: "seeker",
    displayName: "سارة المطيري",
  },
  {
    username: "contributor",
    password: "contrib123",
    role: "contributor",
    displayName: "نورة الدوسري",
  },
  {
    username: "reviewer",
    password: "review123",
    role: "reviewer",
    displayName: "عبدالعزيز العتيبي",
  },
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    displayName: "فهد القحطاني",
  },
  {
    username: "superadmin",
    password: "superadmin123",
    role: "superAdmin",
    displayName: "ماجد الحربي",
  },
]

export const ROLE_LANDING: Record<UserRole, string> = {
  seeker: "/",
  contributor: "/",
  reviewer: "/",
  admin: "/",
  superAdmin: "/analytics",
}

export function findDemoUser(username: string, password: string) {
  const normalized = username.trim().toLowerCase()
  return DEMO_USERS.find(
    (u) => u.username === normalized && u.password === password,
  )
}
