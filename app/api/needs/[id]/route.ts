import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getNeed, voteNeed } from "@/lib/db/repositories/collaboration.repository"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const need = await getNeed(id, locale)
  if (!need) return errorResponse("not_found", 404)
  return jsonResponse({ need })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession()
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as { action?: string }

  if (body.action === "vote") {
    const need = await voteNeed(id, locale)
    if (!need) return errorResponse("not_found", 404)
    return jsonResponse({ need })
  }

  return errorResponse("invalid_action", 400)
}
