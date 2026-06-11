import type { AuditEntry, Role } from "@/types/domain"

export const auditLog: AuditEntry[] = [
  { id: "A-9001", user: "Abdulaziz Al-Otaibi", action: "Content approval", target: "KA-1051 Project management plan template", time: "2026-05-22 10:42", ip: "10.12.4.21", result: "Success" },
  { id: "A-9002", user: "Reem Al-Shammari", action: "Policy update", target: "KA-1029 Data classification policy", time: "2026-05-22 09:15", ip: "10.12.4.55", result: "Success" },
  { id: "A-9003", user: "External user", action: "Restricted access attempt", target: "KA-1070 Expertise report", time: "2026-05-22 08:50", ip: "10.12.7.103", result: "Denied" },
  { id: "A-9004", user: "Noura Al-Dosari", action: "Content upload", target: "KA-1038 Lesson learned", time: "2026-05-21 16:30", ip: "10.12.4.32", result: "Success" },
  { id: "A-9005", user: "Fahad Al-Qahtani", action: "Login (SSO)", target: "Platform portal", time: "2026-05-21 08:02", ip: "10.12.4.18", result: "Success" },
  { id: "A-9006", user: "Sarah Al-Mutairi", action: "Access request", target: "KA-1029 Policy (confidential)", time: "2026-05-20 14:11", ip: "10.12.4.77", result: "Success" },
  { id: "A-9007", user: "Hind Al-Zahrani", action: "Version update", target: "KA-1085 Training guide", time: "2026-05-20 11:48", ip: "10.12.4.61", result: "Success" },
]

export const roles: Role[] = [
  { id: "seeker", name: "Knowledge seeker", users: 1240, desc: "Browse, search, and use approved content.", permissions: { create: false, review: false, approve: false, publish: false, admin: false } },
  { id: "contributor", name: "Content contributor", users: 386, desc: "Create and upload content and submit for review.", permissions: { create: true, review: false, approve: false, publish: false, admin: false } },
  { id: "reviewer", name: "Reviewer", users: 64, desc: "Review content, comment, and return for revision.", permissions: { create: true, review: true, approve: false, publish: false, admin: false } },
  { id: "approver", name: "Approver", users: 28, desc: "Approve and publish content after review.", permissions: { create: true, review: true, approve: true, publish: true, admin: false } },
  { id: "km", name: "Knowledge manager", users: 9, desc: "Manage classifications, needs, and indicators.", permissions: { create: true, review: true, approve: true, publish: true, admin: false } },
  { id: "admin", name: "Platform administrator", users: 5, desc: "Manage users, permissions, and settings.", permissions: { create: true, review: true, approve: true, publish: true, admin: true } },
]
