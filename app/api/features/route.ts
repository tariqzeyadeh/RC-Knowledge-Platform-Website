import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { listFeatures } from "@/lib/db/repositories/catalog.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const features = await listFeatures(locale)
  return jsonResponse({ features })
}
