import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { getTransferSession } from "@/lib/db/repositories/collaboration.repository"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const session = await getTransferSession(id, locale)
  if (!session) return errorResponse("not_found", 404)
  return jsonResponse({ session })
}
