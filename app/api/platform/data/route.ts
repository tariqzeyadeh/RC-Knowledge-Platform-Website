import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { getPlatformBootstrap } from "@/lib/api/bootstrap"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const data = await getPlatformBootstrap(locale)
  return jsonResponse(data)
}
