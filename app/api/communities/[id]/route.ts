import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  createCommunityPost,
  getCommunity,
  joinCommunity,
} from "@/lib/db/repositories/collaboration.repository"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const community = await getCommunity(id, locale)
  if (!community) return errorResponse("not_found", 404)
  return jsonResponse({ community })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession()
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as { action?: string; title?: string }

  if (body.action === "join") {
    const community = await joinCommunity(id, locale)
    if (!community) return errorResponse("not_found", 404)
    return jsonResponse({ community })
  }

  if (body.action === "post") {
    const title = body.title?.trim()
    if (!title) return errorResponse("title_required", 400)
    const community = await createCommunityPost(id, { title, author: user.displayName }, locale)
    if (!community) return errorResponse("not_found", 404)
    return jsonResponse({ community })
  }

  return errorResponse("invalid_action", 400)
}
