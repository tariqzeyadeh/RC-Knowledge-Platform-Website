import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { listReviewQueue } from "@/lib/db/repositories/collaboration.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const items = await listReviewQueue(locale)
  return jsonResponse({ items })
}
