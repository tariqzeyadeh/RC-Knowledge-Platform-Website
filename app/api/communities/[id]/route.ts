import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getCommunity } from "@/lib/db/repositories/collaboration.repository"

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
