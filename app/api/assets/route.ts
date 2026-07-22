import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getDb } from "@/lib/db"
import { reviewItems } from "@/lib/db/schema"
import {
  createAttachment,
  linkAttachments,
  resolveFileTypeId,
} from "@/lib/db/repositories/attachment.repository"
import { createAsset, listAssets, searchAssets } from "@/lib/db/repositories/asset.repository"
import { resolveLookupIdByLabel } from "@/lib/db/repositories/lookup.repository"
import type { AssetSort } from "@/types/domain"

const MAX_FILE_BYTES = 10 * 1024 * 1024

type CreateAssetBody = {
  titleAr: string
  titleEn?: string
  knowledgeTypeId?: string
  knowledgeTypeLabel?: string
  categoryId: string
  departmentId?: string
  departmentLabel?: string
  confidentialityId: string
  summaryAr: string
  summaryEn?: string
  fileTypeId?: string
  keywordsAr?: string[]
  keywordsEn?: string[]
  nextReview?: string
  attachmentId?: string
}

async function parseCreateAssetRequest(request: Request, userDisplayName: string) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const file = formData.get("file")
    const metadataRaw = formData.get("metadata")
    const metadata = JSON.parse(String(metadataRaw ?? "{}")) as CreateAssetBody

    let attachmentId = metadata.attachmentId
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_BYTES) throw new Error("file_too_large")
      const buffer = Buffer.from(await file.arrayBuffer())
      const attachment = await createAttachment({
        id: `ATT-${Date.now()}`,
        entityType: "pending",
        entityId: "pending",
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileTypeId: resolveFileTypeId(file.name),
        sizeBytes: file.size,
        contentBase64: buffer.toString("base64"),
        uploadedBy: userDisplayName,
      })
      attachmentId = attachment?.id
      metadata.fileTypeId = resolveFileTypeId(file.name)
    }

    return { body: metadata, attachmentId }
  }

  const body = (await request.json()) as CreateAssetBody
  return { body, attachmentId: body.attachmentId }
}

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const url = new URL(request.url)

  const query = url.searchParams.get("q") ?? ""
  const categoryId = url.searchParams.get("categoryId") ?? "all"
  const type = url.searchParams.get("type") ?? "all"
  const department = url.searchParams.get("department") ?? "all"
  const confidentiality = url.searchParams.get("confidentiality") ?? "all"
  const fileType = url.searchParams.get("fileType") ?? "all"
  const dateFrom = url.searchParams.get("dateFrom") ?? ""
  const dateTo = url.searchParams.get("dateTo") ?? ""
  const sort = (url.searchParams.get("sort") as AssetSort | null) ?? "relevance"

  const hasFilters =
    query ||
    categoryId !== "all" ||
    type !== "all" ||
    department !== "all" ||
    confidentiality !== "all" ||
    fileType !== "all" ||
    dateFrom ||
    dateTo

  const assets = hasFilters
    ? await searchAssets(
        { query, categoryId, type, department, confidentiality, fileType, dateFrom, dateTo },
        sort,
        locale,
      )
    : await listAssets(locale)

  return jsonResponse({ assets })
}

export async function POST(request: Request) {
  const user = await requireSession(["contributor", "reviewer", "admin"])
  if (!user) return errorResponse("unauthorized", 401)

  const locale = getLocaleFromRequest(request)

  let body: CreateAssetBody
  let attachmentId: string | undefined
  try {
    const parsed = await parseCreateAssetRequest(request, user.displayName)
    body = parsed.body
    attachmentId = parsed.attachmentId
  } catch {
    return errorResponse("invalid_request", 400)
  }

  if (!body.titleAr?.trim() || !body.categoryId || !body.confidentialityId || !body.summaryAr?.trim()) {
    return errorResponse("invalid_request", 400)
  }

  const knowledgeTypeId =
    body.knowledgeTypeId ??
    (body.knowledgeTypeLabel
      ? await resolveLookupIdByLabel("knowledge_type", body.knowledgeTypeLabel, locale)
      : undefined) ??
    "procedure-guide"

  const departmentId =
    body.departmentId ??
    (body.departmentLabel
      ? await resolveLookupIdByLabel("department", body.departmentLabel, locale)
      : undefined) ??
    "dept-km"

  const id = `KA-${Date.now()}`
  const today = new Date().toISOString().slice(0, 10)
  const asset = await createAsset(
    {
      id,
      titleAr: body.titleAr,
      titleEn: body.titleEn,
      knowledgeTypeId,
      categoryId: body.categoryId,
      departmentId,
      author: user.displayName,
      confidentialityId: body.confidentialityId,
      version: "1.0",
      updated: today,
      nextReview: body.nextReview ?? today,
      status: "review",
      summaryAr: body.summaryAr,
      summaryEn: body.summaryEn,
      fileTypeId: body.fileTypeId ?? "pdf",
      keywordsAr: body.keywordsAr,
      keywordsEn: body.keywordsEn,
    },
    locale,
  )

  if (attachmentId) {
    await linkAttachments("knowledge_asset", id, [attachmentId])
  }

  await getDb().insert(reviewItems).values({
    id: `RV-${Date.now()}`,
    title: body.titleAr,
    knowledgeTypeId,
    submittedBy: user.displayName,
    departmentId,
    submittedAt: today,
    stageId: "rs-review",
    sla: locale === "en" ? "Within 2 days" : "خلال يومين",
    priorityId: "rp-medium",
    assetId: id,
  })

  return jsonResponse({ asset, attachmentId }, { status: 201 })
}
