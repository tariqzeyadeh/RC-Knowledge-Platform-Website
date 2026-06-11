import { knowledgeRepository } from "@/repositories/knowledge.repository"
import type { Locale } from "@/i18n"
import type { AssetSort, KnowledgeAsset } from "@/types/domain"

function assetSearchText(asset: KnowledgeAsset) {
  return `${asset.title} ${asset.summary} ${asset.keywords.join(" ")} ${asset.department}`.toLowerCase()
}

/** Business logic — advanced search (F-12) */
export function searchAssets(query: string, sort: AssetSort = "relevance", locale: Locale = "ar"): KnowledgeAsset[] {
  const normalized = query.trim().toLowerCase()
  let results = knowledgeRepository.listAssets(locale)

  if (normalized) {
    results = results.filter((asset) => assetSearchText(asset).includes(normalized))
  }

  const sorted = [...results]
  if (sort === "recent") sorted.sort((a, b) => b.updated.localeCompare(a.updated))
  if (sort === "popular") sorted.sort((a, b) => b.views - a.views)
  return sorted
}
