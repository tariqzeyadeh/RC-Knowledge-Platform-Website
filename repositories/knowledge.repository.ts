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

  listDepartments(locale: Locale = "ar") {
    const departments = new Set(
      localizedData.knowledge(locale).assets.map((asset) => asset.department),
    )
    return [...departments].sort((a, b) => a.localeCompare(b, locale === "ar" ? "ar" : "en"))
  },

  listFileTypes(locale: Locale = "ar") {
    const types = new Set(
      localizedData.knowledge(locale).assets.map((asset) => asset.fileType),
    )
    return [...types].sort()
  },
}
