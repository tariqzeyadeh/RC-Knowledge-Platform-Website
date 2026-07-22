import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { listAuditLog } from "@/lib/db/repositories/catalog.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const auditLog = await listAuditLog(locale)
  return jsonResponse({ auditLog })
}
