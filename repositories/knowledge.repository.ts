import { localizedData } from "@/data/localized"
import type { Locale } from "@/i18n"
import type { KnowledgeAsset } from "@/types/domain"

/** Data access — knowledge library (F-16, F-17) */
export const knowledgeRepository = {
  listAssets(locale: Locale = "ar"): KnowledgeAsset[] {
    return localizedData.knowledge(locale).assets
  },

  getAsset(id: string, locale: Locale = "ar") {
    return localizedData.knowledge(locale).assets.find((a) => a.id === id)
  },

  listCategories(locale: Locale = "ar") {
    return localizedData.knowledge(locale).categories
  },

  getCategory(id: string, locale: Locale = "ar") {
    return localizedData.knowledge(locale).categories.find((c) => c.id === id)
  },

  listKnowledgeTypes(locale: Locale = "ar") {
    return localizedData.knowledge(locale).knowledgeTypes
  },

  listConfidentialityLevels(locale: Locale = "ar") {
    return localizedData.knowledge(locale).confidentialityLevels
  },
}
