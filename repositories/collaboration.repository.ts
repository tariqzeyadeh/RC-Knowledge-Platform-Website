import { localizedData } from "@/data/localized"
import type { Locale } from "@/i18n"

/** Data access — socialization & contribution (F-01–F-04, F-18) */
export const collaborationRepository = {
  listCommunities(locale: Locale = "ar") {
    return localizedData.collaboration(locale).communities
  },

  getCommunity(id: string, locale: Locale = "ar") {
    return localizedData.collaboration(locale).communities.find((c) => c.id === id)
  },

  listTransferSessions(locale: Locale = "ar") {
    return localizedData.collaboration(locale).transferSessions
  },

  getTransferSession(id: string, locale: Locale = "ar") {
    return localizedData.collaboration(locale).transferSessions.find((s) => s.id === id)
  },

  listReviewQueue(locale: Locale = "ar") {
    return localizedData.collaboration(locale).reviewQueue
  },

  listNeeds(locale: Locale = "ar") {
    return localizedData.collaboration(locale).needs
  },

  getNeed(id: string, locale: Locale = "ar") {
    return localizedData.collaboration(locale).needs.find((n) => n.id === id)
  },

  listNotifications(locale: Locale = "ar") {
    return localizedData.collaboration(locale).notifications
  },
}
