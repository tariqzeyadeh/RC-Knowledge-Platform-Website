import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { getNeed } from "@/lib/db/repositories/collaboration.repository"

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
