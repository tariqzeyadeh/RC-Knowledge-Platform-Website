import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { listTrainingPrograms } from "@/lib/db/repositories/catalog.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const trainingPrograms = await listTrainingPrograms(locale)
  return jsonResponse({ trainingPrograms })
}
