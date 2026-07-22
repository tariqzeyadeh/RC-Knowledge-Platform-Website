import { jsonResponse } from "@/lib/api/http"
import { listNotifications, markAllNotificationsRead } from "@/lib/db/repositories/collaboration.repository"

export async function GET() {
  const notifications = await listNotifications("ar")
  return jsonResponse({ notifications })
}

export async function PATCH() {
  await markAllNotificationsRead()
  return jsonResponse({ ok: true })
}
