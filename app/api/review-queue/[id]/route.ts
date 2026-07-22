import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { listReviewQueue, updateReviewStage } from "@/lib/db/repositories/collaboration.repository"
import { updateAsset } from "@/lib/db/repositories/asset.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const items = await listReviewQueue(locale)
  return jsonResponse({ items })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["reviewer", "admin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as { action: "approve" | "return"; assetId?: string }

  if (body.action === "approve") {
    const item = await updateReviewStage(id, "rs-approval", locale)
    if (body.assetId) {
      await updateAsset(body.assetId, { status: "published" }, locale)
    }
    return jsonResponse({ item })
  }

  const item = await updateReviewStage(id, "rs-draft", locale)
  return jsonResponse({ item })
}
