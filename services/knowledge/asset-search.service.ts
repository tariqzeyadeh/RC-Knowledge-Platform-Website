import { knowledgeRepository } from "@/repositories/knowledge.repository"
import type { Locale } from "@/i18n"
import type { AssetSort, KnowledgeAsset, SearchFilters } from "@/types/domain"

/** Supported file formats for search filter (spec p.20) */
export const SEARCH_FILE_FORMATS = ["PDF", "DOCX", "DOC", "XLSX", "XLS", "PPTX", "PPT"] as const

/** Simulates full-text index: title, summary, keywords, department, type */
function assetSearchText(asset: KnowledgeAsset) {
  return `${asset.title} ${asset.summary} ${asset.keywords.join(" ")} ${asset.department} ${asset.type}`.toLowerCase()
}

function matchesDateRange(asset: KnowledgeAsset, dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) return true
  const updated = asset.updated
  if (dateFrom && updated < dateFrom) return false
  if (dateTo && updated > dateTo) return false
  return true
}

/** Business logic — advanced search with full-text + filters (F-12, spec p.20) */
export function searchAssets(
  filters: SearchFilters,
  sort: AssetSort = "relevance",
  locale: Locale = "ar",
): KnowledgeAsset[] {
  const { query, categoryId, type, confidentiality, department, fileType, dateFrom, dateTo } = filters
  const normalized = query?.trim().toLowerCase() ?? ""

  let results = knowledgeRepository.listAssets(locale).filter((asset) => {
    if (categoryId && categoryId !== "all" && asset.category !== categoryId) return false
    if (type && type !== "all" && asset.type !== type) return false
    if (confidentiality && confidentiality !== "all" && asset.confidentiality !== confidentiality) return false
    if (department && department !== "all" && asset.department !== department) return false
    if (fileType && fileType !== "all" && asset.fileType !== fileType) return false
    if (!matchesDateRange(asset, dateFrom, dateTo)) return false
    if (normalized && !assetSearchText(asset).includes(normalized)) return false
    return true
  })

  const sorted = [...results]
  if (sort === "recent") sorted.sort((a, b) => b.updated.localeCompare(a.updated))
  if (sort === "popular") sorted.sort((a, b) => b.views - a.views)
  if (sort === "relevance" && normalized) {
    sorted.sort((a, b) => {
      const score = (asset: KnowledgeAsset) => {
        const text = assetSearchText(asset)
        let s = 0
        if (asset.title.toLowerCase().includes(normalized)) s += 4
        if (asset.keywords.some((k) => k.toLowerCase().includes(normalized))) s += 3
        if (text.includes(normalized)) s += 1
        return s
      }
      return score(b) - score(a) || b.updated.localeCompare(a.updated)
    })
  }

  return sorted
}

export function listSearchDepartments(locale: Locale = "ar") {
  return knowledgeRepository.listDepartments(locale)
}

export function listSearchFileTypes(_locale: Locale = "ar") {
  return [...SEARCH_FILE_FORMATS]
}
