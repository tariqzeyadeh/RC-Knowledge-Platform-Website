import { jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  deleteBroadcastMessage,
  updateBroadcastMessage,
} from "@/lib/db/repositories/admin.repository"
import type { BroadcastMessage } from "@/types/broadcast"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const body = (await request.json()) as Partial<BroadcastMessage>
  await updateBroadcastMessage(id, body)
  return jsonResponse({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  await deleteBroadcastMessage(id)
  return jsonResponse({ ok: true })
}
