import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { getPlatformBootstrap } from "@/lib/api/bootstrap"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const data = await getPlatformBootstrap(locale)
  return jsonResponse(data, {
    headers: {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
    },
  })
}
