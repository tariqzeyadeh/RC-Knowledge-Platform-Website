import { jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getWorkflowRoutingRules } from "@/lib/db/repositories/admin.repository"

export async function GET() {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const rules = await getWorkflowRoutingRules()
  return jsonResponse({ rules })
}
