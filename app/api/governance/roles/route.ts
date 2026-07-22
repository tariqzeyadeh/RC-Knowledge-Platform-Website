import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { listGovernanceRoles } from "@/lib/db/repositories/catalog.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const roles = await listGovernanceRoles(locale)
  return jsonResponse({ roles })
}
