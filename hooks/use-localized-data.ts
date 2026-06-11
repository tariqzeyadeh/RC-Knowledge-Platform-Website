"use client"

import { useMemo } from "react"
import { localizedData } from "@/data/localized"
import { useLocale } from "@/hooks/use-locale"

export function useLocalizedData() {
  const { locale } = useLocale()

  return useMemo(() => {
    const knowledge = localizedData.knowledge(locale)
    const collaboration = localizedData.collaboration(locale)
    const analytics = localizedData.analytics(locale)
    const governance = localizedData.governance(locale)
    const features = localizedData.features(locale)
    const seci = localizedData.seci(locale)

    return {
      locale,
      ...knowledge,
      ...collaboration,
      ...analytics,
      ...governance,
      ...features,
      ...seci,
      seciLayers: seci.seciLayers,
      getAsset: (id: string) => knowledge.assets.find((a) => a.id === id),
      getCategory: (id: string) => knowledge.categories.find((c) => c.id === id),
      getCommunity: (id: string) => collaboration.communities.find((c) => c.id === id),
      getTransferSession: (id: string) => collaboration.transferSessions.find((s) => s.id === id),
      getNeed: (id: string) => collaboration.needs.find((n) => n.id === id),
    }
  }, [locale])
}
