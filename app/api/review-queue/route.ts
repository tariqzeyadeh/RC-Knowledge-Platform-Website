import { jsonResponse } from "@/lib/api/http"
import { listReviewQueue } from "@/lib/db/repositories/collaboration.repository"

export async function GET() {
  const items = await listReviewQueue("ar")
  return jsonResponse({ items })
}
