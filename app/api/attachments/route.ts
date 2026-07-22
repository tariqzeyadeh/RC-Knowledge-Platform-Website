import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  createAttachment,
  getAttachmentWithContent,
  listAttachments,
  resolveFileTypeId,
} from "@/lib/db/repositories/attachment.repository"

const MAX_FILE_BYTES = 10 * 1024 * 1024

export async function POST(request: Request) {
  const user = await requireSession()
  if (!user) return errorResponse("unauthorized", 401)

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) return errorResponse("file_required", 400)

  if (file.size > MAX_FILE_BYTES) return errorResponse("file_too_large", 400)

  const entityType = String(formData.get("entityType") ?? "pending")
  const entityId = String(formData.get("entityId") ?? "pending")
  const buffer = Buffer.from(await file.arrayBuffer())
  const attachment = await createAttachment({
    id: `ATT-${Date.now()}`,
    entityType,
    entityId,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    fileTypeId: resolveFileTypeId(file.name),
    sizeBytes: file.size,
    contentBase64: buffer.toString("base64"),
    uploadedBy: user.displayName,
  })

  return jsonResponse({ attachment }, { status: 201 })
}

export async function GET(request: Request) {
  const user = await requireSession()
  if (!user) return errorResponse("unauthorized", 401)

  getLocaleFromRequest(request)
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const entityType = url.searchParams.get("entityType")
  const entityId = url.searchParams.get("entityId")

  if (entityType && entityId) {
    const items = await listAttachments(entityType, entityId)
    return jsonResponse({ attachments: items })
  }

  if (!id) return errorResponse("id_required", 400)

  const row = await getAttachmentWithContent(id)
  if (!row) return errorResponse("not_found", 404)

  const buffer = Buffer.from(row.contentBase64, "base64")
  return new Response(buffer, {
    headers: {
      "Content-Type": row.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(row.fileName)}"`,
      "Content-Length": String(buffer.length),
    },
  })
}
