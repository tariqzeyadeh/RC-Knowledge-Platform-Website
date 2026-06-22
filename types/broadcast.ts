import type { UserRole } from "@/types/auth"

export type BroadcastKind = "announcement" | "notification"

export type BroadcastStatus = "draft" | "scheduled" | "published" | "archived"

export type BroadcastAudience = "all" | UserRole

export type BroadcastPriority = "normal" | "high" | "urgent"

export type SystemNotificationType = "review" | "approved" | "rejected" | "new" | "expiry" | "access"

export type BroadcastMessage = {
  id: string
  kind: BroadcastKind
  title: string
  body: string
  audience: BroadcastAudience
  priority: BroadcastPriority
  status: BroadcastStatus
  notificationType?: SystemNotificationType
  createdBy: string
  createdAt: string
  scheduledAt?: string
  publishedAt?: string
}
