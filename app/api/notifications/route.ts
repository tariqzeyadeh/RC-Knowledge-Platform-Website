import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { listNotifications, markAllNotificationsRead } from "@/lib/db/repositories/collaboration.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const notifications = await listNotifications(locale)
  return jsonResponse({ notifications })
}

export async function PATCH() {
  const user = await requireSession()
  if (!user) return jsonResponse({ error: "unauthorized" }, { status: 401 })

  await markAllNotificationsRead()
  return jsonResponse({ ok: true })
}
