import { localizedData } from "@/data/localized"
import type { Locale } from "@/i18n"

/** Data access — KPIs and dashboards (F-15) */
export const analyticsRepository = {
  listKpis(locale: Locale = "ar") {
    return localizedData.analytics(locale).kpis
  },

  getMonthlyActivity(locale: Locale = "ar") {
    return localizedData.analytics(locale).monthlyActivity
  },

  getDepartmentContribution(locale: Locale = "ar") {
    return localizedData.analytics(locale).departmentContribution
  },

  getContentHealth(locale: Locale = "ar") {
    return localizedData.analytics(locale).contentHealth
  },

  getTopSearches(locale: Locale = "ar") {
    return localizedData.analytics(locale).topSearches
  },

  getTopContributors(locale: Locale = "ar") {
    return localizedData.analytics(locale).topContributors
  },

  getTopCommunities(locale: Locale = "ar") {
    return localizedData.analytics(locale).topCommunities
  },
}
