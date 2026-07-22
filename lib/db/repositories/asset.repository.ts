import { and, asc, desc, eq, inArray } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { assetKeywords, assetVersions, knowledgeAssets } from "@/lib/db/schema"
import { getLookupLabel } from "@/lib/db/repositories/lookup.repository"
import { readCachedLookupLabel } from "@/lib/db/repositories/lookup-cache"
import type { Locale } from "@/i18n"
import type { AssetSort, KnowledgeAsset, SearchFilters } from "@/types/domain"

async function mapAsset(
  row: typeof knowledgeAssets.$inferSelect,
  locale: Locale,
  keywords: string[],
): Promise<KnowledgeAsset> {
  const type =
    readCachedLookupLabel("knowledge_type", row.knowledgeTypeId, locale) ??
    (await getLookupLabel("knowledge_type", row.knowledgeTypeId, locale))
  const department =
    readCachedLookupLabel("department", row.departmentId, locale) ??
    (await getLookupLabel("department", row.departmentId, locale))
  const fileType =
    readCachedLookupLabel("file_type", row.fileTypeId, locale) ??
    (await getLookupLabel("file_type", row.fileTypeId, locale))

  return {
    id: row.id,
    title: locale === "en" && row.titleEn ? row.titleEn : row.titleAr,
    type,
    category: row.categoryId,
    department,
    author: row.author,
    confidentiality: row.confidentialityId as KnowledgeAsset["confidentiality"],
    version: row.version,
    updated: row.updated,
    nextReview: row.nextReview,
    views: row.views,
    rating: row.rating,
    status: row.status as KnowledgeAsset["status"],
    keywords,
    summary: locale === "en" && row.summaryEn ? row.summaryEn : row.summaryAr,
    fileType,
  }
}

async function getKeywordsForAssets(assetIds: string[], locale: Locale) {
  if (assetIds.length === 0) return new Map<string, string[]>()

  const db = getDb()
  const rows = await db
    .select()
    .from(assetKeywords)
    .where(and(eq(assetKeywords.locale, locale), inArray(assetKeywords.assetId, assetIds)))

  const map = new Map<string, string[]>()
  for (const row of rows) {
    const list = map.get(row.assetId) ?? []
    list.push(row.keyword)
    map.set(row.assetId, list)
  }
  return map
}

export async function listAssets(locale: Locale = "ar"): Promise<KnowledgeAsset[]> {
  const db = getDb()
  const rows = await db.select().from(knowledgeAssets).orderBy(desc(knowledgeAssets.updated))
  const keywordMap = await getKeywordsForAssets(
    rows.map((row) => row.id),
    locale,
  )

  return Promise.all(
    rows.map((row) => mapAsset(row, locale, keywordMap.get(row.id) ?? [])),
  )
}

export async function getAsset(id: string, locale: Locale = "ar") {
  const db = getDb()
  const row = await db.select().from(knowledgeAssets).where(eq(knowledgeAssets.id, id)).get()
  if (!row) return null

  const keywords = await db
    .select()
    .from(assetKeywords)
    .where(and(eq(assetKeywords.assetId, id), eq(assetKeywords.locale, locale)))

  return mapAsset(
    row,
    locale,
    keywords.map((keyword) => keyword.keyword),
  )
}

export async function searchAssets(
  filters: SearchFilters,
  sort: AssetSort = "relevance",
  locale: Locale = "ar",
): Promise<KnowledgeAsset[]> {
  let results = await listAssets(locale)
  const normalized = filters.query?.trim().toLowerCase() ?? ""

  results = results.filter((asset) => {
    if (filters.categoryId && filters.categoryId !== "all" && asset.category !== filters.categoryId) {
      return false
    }
    if (filters.type && filters.type !== "all" && asset.type !== filters.type) return false
    if (filters.confidentiality && filters.confidentiality !== "all" && asset.confidentiality !== filters.confidentiality) {
      return false
    }
    if (filters.department && filters.department !== "all" && asset.department !== filters.department) {
      return false
    }
    if (filters.fileType && filters.fileType !== "all" && asset.fileType !== filters.fileType) {
      return false
    }
    if (filters.dateFrom && asset.updated < filters.dateFrom) return false
    if (filters.dateTo && asset.updated > filters.dateTo) return false
    if (normalized) {
      const haystack = `${asset.title} ${asset.summary} ${asset.keywords.join(" ")} ${asset.department} ${asset.type}`.toLowerCase()
      if (!haystack.includes(normalized)) return false
    }
    return true
  })

  if (sort === "recent") {
    results.sort((a, b) => b.updated.localeCompare(a.updated))
  } else if (sort === "popular") {
    results.sort((a, b) => b.views - a.views)
  } else if (sort === "relevance" && normalized) {
    results.sort((a, b) => {
      const score = (asset: KnowledgeAsset) => {
        let value = 0
        if (asset.title.toLowerCase().includes(normalized)) value += 4
        if (asset.keywords.some((keyword) => keyword.toLowerCase().includes(normalized))) value += 3
        if (`${asset.title} ${asset.summary}`.toLowerCase().includes(normalized)) value += 1
        return value
      }
      return score(b) - score(a) || b.updated.localeCompare(a.updated)
    })
  }

  return results
}

export async function createAsset(
  data: {
    id: string
    titleAr: string
    titleEn?: string
    knowledgeTypeId: string
    categoryId: string
    departmentId: string
    author: string
    confidentialityId: string
    version: string
    updated: string
    nextReview: string
    status: KnowledgeAsset["status"]
    summaryAr: string
    summaryEn?: string
    fileTypeId: string
    keywordsAr?: string[]
    keywordsEn?: string[]
  },
  locale: Locale = "ar",
) {
  const db = getDb()
  const now = new Date().toISOString()

  await db.insert(knowledgeAssets).values({
    id: data.id,
    titleAr: data.titleAr,
    titleEn: data.titleEn,
    knowledgeTypeId: data.knowledgeTypeId,
    categoryId: data.categoryId,
    departmentId: data.departmentId,
    author: data.author,
    confidentialityId: data.confidentialityId,
    version: data.version,
    updated: data.updated,
    nextReview: data.nextReview,
    views: 0,
    rating: 0,
    status: data.status,
    summaryAr: data.summaryAr,
    summaryEn: data.summaryEn,
    fileTypeId: data.fileTypeId,
    createdAt: now,
  })

  const keywordRows = [
    ...(data.keywordsAr ?? []).map((keyword) => ({
      assetId: data.id,
      locale: "ar" as const,
      keyword,
    })),
    ...(data.keywordsEn ?? []).map((keyword) => ({
      assetId: data.id,
      locale: "en" as const,
      keyword,
    })),
  ]

  if (keywordRows.length > 0) {
    await db.insert(assetKeywords).values(keywordRows)
  }

  return getAsset(data.id, locale)
}

export async function updateAsset(
  id: string,
  data: Partial<typeof knowledgeAssets.$inferInsert>,
  locale: Locale = "ar",
) {
  const db = getDb()
  await db.update(knowledgeAssets).set(data).where(eq(knowledgeAssets.id, id))
  return getAsset(id, locale)
}

export async function deleteAsset(id: string) {
  const db = getDb()
  await db.delete(knowledgeAssets).where(eq(knowledgeAssets.id, id))
}

export async function listAssetVersions(assetId: string) {
  const db = getDb()
  return db
    .select()
    .from(assetVersions)
    .where(eq(assetVersions.assetId, assetId))
    .orderBy(desc(assetVersions.date))
}

export async function getSearchSuggestions(query: string, locale: Locale, limit = 8) {
  const assets = await listAssets(locale)
  const normalized = query.trim().toLowerCase()
  const terms = assets.map((asset) => asset.title)

  if (!normalized) {
    return terms.slice(0, limit)
  }

  return terms
    .filter((term) => term.toLowerCase().includes(normalized))
    .sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      const aScore = aLower.startsWith(normalized) ? 2 : 1
      const bScore = bLower.startsWith(normalized) ? 2 : 1
      return bScore - aScore || a.localeCompare(b, locale)
    })
    .slice(0, limit)
}
