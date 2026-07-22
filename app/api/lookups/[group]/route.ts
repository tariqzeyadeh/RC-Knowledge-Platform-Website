import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { listLookups } from "@/lib/db/repositories/lookup.repository"

const ALLOWED_GROUPS = new Set([
  "category",
  "knowledge_type",
  "confidentiality",
  "department",
  "file_type",
  "asset_status",
  "domain",
  "transfer_session_type",
  "transfer_session_status",
  "transfer_output_status",
  "transfer_duration",
  "review_stage",
  "review_priority",
  "need_priority",
  "need_status",
  "need_unit",
  "audit_result",
  "compliance_status",
  "popular_search",
  "search_suggestion",
])

export async function GET(
  request: Request,
  { params }: { params: Promise<{ group: string }> },
) {
  const { group } = await params
  if (!ALLOWED_GROUPS.has(group)) {
    return errorResponse("invalid_lookup_group", 404)
  }

  const locale = getLocaleFromRequest(request)
  const items = await listLookups(group, locale)
  return jsonResponse({ group, items })
}
