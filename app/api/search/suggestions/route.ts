import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { getSearchSuggestions } from "@/lib/db/repositories/asset.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const url = new URL(request.url)
  const query = url.searchParams.get("q") ?? ""
  const limit = Number(url.searchParams.get("limit") ?? "8")
  const suggestions = await getSearchSuggestions(query, locale, limit)
  return jsonResponse({ suggestions })
}
