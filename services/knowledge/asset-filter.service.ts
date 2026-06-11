import { knowledgeRepository } from "@/repositories/knowledge.repository"
import type { Locale } from "@/i18n"
import type { AssetFilters, KnowledgeAsset } from "@/types/domain"

function matchesQuery(asset: KnowledgeAsset, query?: string) {
  if (!query?.trim()) return true
  const q = query.trim().toLowerCase()
  return `${asset.title} ${asset.summary} ${asset.keywords.join(" ")}`.toLowerCase().includes(q)
}

/** Business logic — library browse & filters (F-16, F-17) */
export function filterAssets(filters: AssetFilters, locale: Locale = "ar"): KnowledgeAsset[] {
  const { query, categoryId, type, confidentiality } = filters

  return knowledgeRepository.listAssets(locale).filter((asset) => {
    if (categoryId && categoryId !== "all" && asset.category !== categoryId) return false
    if (type && type !== "all" && asset.type !== type) return false
    if (confidentiality && confidentiality !== "all" && asset.confidentiality !== confidentiality) return false
    if (!matchesQuery(asset, query)) return false
    return true
  })
}

export function getPublishedAssets(limit?: number, locale: Locale = "ar") {
  const published = knowledgeRepository.listAssets(locale).filter((a) => a.status === "published")
  return limit ? published.slice(0, limit) : published
}

export function getRelatedAssets(assetId: string, limit = 3, locale: Locale = "ar") {
  const asset = knowledgeRepository.getAsset(assetId, locale)
  if (!asset) return []
  return knowledgeRepository
    .listAssets(locale)
    .filter((a) => a.id !== assetId && a.category === asset.category)
    .slice(0, limit)
}
