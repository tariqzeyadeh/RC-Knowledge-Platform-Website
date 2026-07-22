import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { deleteAsset, getAsset, listAssetVersions, updateAsset } from "@/lib/db/repositories/asset.repository"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const asset = await getAsset(id, locale)
  if (!asset) return errorResponse("not_found", 404)

  const versions = await listAssetVersions(id)
  return jsonResponse({
    asset,
    versions: versions.map((version) => ({
      v: version.version,
      date: version.date,
      by: version.author,
      note: version.note,
    })),
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["reviewer", "admin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as Record<string, unknown>
  const asset = await updateAsset(id, body, locale)
  if (!asset) return errorResponse("not_found", 404)
  return jsonResponse({ asset })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["admin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  await deleteAsset(id)
  return jsonResponse({ ok: true })
}
