import { broadcastsRepository } from "@/repositories/broadcasts.repository"
import type { BroadcastKind, BroadcastMessage, BroadcastStatus } from "@/types/broadcast"

export function listBroadcastMessages(): BroadcastMessage[] {
  return broadcastsRepository.listMessages()
}

export function summarizeBroadcasts(messages: BroadcastMessage[]) {
  return {
    total: messages.length,
    announcements: messages.filter((m) => m.kind === "announcement").length,
    notifications: messages.filter((m) => m.kind === "notification").length,
    scheduled: messages.filter((m) => m.status === "scheduled").length,
    published: messages.filter((m) => m.status === "published").length,
    draft: messages.filter((m) => m.status === "draft").length,
  }
}

export function filterByKind(messages: BroadcastMessage[], kind: BroadcastKind | "all") {
  if (kind === "all") return messages
  return messages.filter((m) => m.kind === kind)
}

export function filterByStatus(messages: BroadcastMessage[], status: BroadcastStatus | "all") {
  if (status === "all") return messages
  return messages.filter((m) => m.status === status)
}
