import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { getDb } from "@/lib/db"
import { reviewItems } from "@/lib/db/schema"
import { createAsset, listAssets, searchAssets } from "@/lib/db/repositories/asset.repository"
import { resolveLookupIdByLabel } from "@/lib/db/repositories/lookup.repository"
import type { AssetSort } from "@/types/domain"

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
  const body = (await request.json()) as {
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
      nextReview: today,
      status: "review",
      summaryAr: body.summaryAr,
      summaryEn: body.summaryEn,
      fileTypeId: body.fileTypeId ?? "pdf",
      keywordsAr: body.keywordsAr,
      keywordsEn: body.keywordsEn,
    },
    locale,
  )

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

  return jsonResponse({ asset }, { status: 201 })
}
