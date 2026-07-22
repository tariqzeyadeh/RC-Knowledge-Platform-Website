import { jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  createBroadcastMessage,
  listBroadcastMessages,
} from "@/lib/db/repositories/admin.repository"
import type { BroadcastMessage } from "@/types/broadcast"

export async function GET() {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const messages = await listBroadcastMessages()
  return jsonResponse({ messages })
}

export async function POST(request: Request) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const body = (await request.json()) as BroadcastMessage
  const message = await createBroadcastMessage(body)
  return jsonResponse({ message }, { status: 201 })
}
