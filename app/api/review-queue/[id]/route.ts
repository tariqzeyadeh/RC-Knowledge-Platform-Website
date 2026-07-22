import { eq } from "drizzle-orm"
import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getDb } from "@/lib/db"
import { reviewItems } from "@/lib/db/schema"
import { updateAsset } from "@/lib/db/repositories/asset.repository"
import { updateReviewStage } from "@/lib/db/repositories/collaboration.repository"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["reviewer", "admin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as { action: "approve" | "return" }

  const db = getDb()
  const row = await db.select().from(reviewItems).where(eq(reviewItems.id, id)).get()
  if (!row) return errorResponse("not_found", 404)

  if (body.action === "approve") {
    const item = await updateReviewStage(id, "rs-approval", locale)
    if (row.assetId) {
      await updateAsset(row.assetId, { status: "published" }, locale)
    }
    return jsonResponse({ item })
  }

  const item = await updateReviewStage(id, "rs-draft", locale)
  if (row.assetId) {
    await updateAsset(row.assetId, { status: "draft" }, locale)
  }
  return jsonResponse({ item })
}
