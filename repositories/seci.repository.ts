import { localizedData } from "@/data/localized"
import type { Locale } from "@/i18n"

/** Data access — SECI model and feature catalog (F-01–F-30) */
export const seciRepository = {
  listLayers(locale: Locale = "ar") {
    return localizedData.seci(locale).seciLayers
  },

  getLayer(id: string, locale: Locale = "ar") {
    return localizedData.seci(locale).seciLayers.find((l) => l.id === id)
  },

  listFeatures(locale: Locale = "ar") {
    return localizedData.features(locale).features
  },

  getFeaturesByLayer(layerId: string, locale: Locale = "ar") {
    return localizedData.features(locale).features.filter((f) => f.layer === layerId)
  },
}
