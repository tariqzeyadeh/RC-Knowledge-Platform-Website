import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { listSeciLayers } from "@/lib/db/repositories/catalog.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const seciLayers = await listSeciLayers(locale)
  return jsonResponse({ seciLayers })
}
