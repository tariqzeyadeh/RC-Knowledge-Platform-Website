"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocale } from "@/hooks/use-locale"
import type { KnowledgeAsset } from "@/types/domain"

type BootstrapData = {
  locale: string
  categories: Array<{ id: string; name: string; count: number; icon: string; topics: string[] }>
  knowledgeTypes: string[]
  confidentialityLevels: Array<{ id: string; name: string; color: string }>
  assets: KnowledgeAsset[]
  departments: string[]
  fileTypes: string[]
  searchSuggestions: string[]
  topSearches: Array<{ term: string; count: number; success: number }>
  communities: unknown[]
  transferSessions: unknown[]
  reviewQueue: unknown[]
  needs: unknown[]
  notifications: unknown[]
  kpis: unknown[]
  monthlyActivity: unknown[]
  departmentContribution: unknown[]
  contentHealth: unknown[]
  topContributors: unknown[]
  topCommunities: unknown[]
  trainingPrograms: unknown[]
  complianceMatrix: unknown[]
  securityControls: unknown[]
  roles: unknown[]
  auditLog: unknown[]
  features: unknown[]
  seciLayers: unknown[]
  workflowStages: unknown[]
  workflowDefinitions: unknown[]
  broadcastMessages: unknown[]
}

const emptyData: BootstrapData = {
  locale: "ar",
  categories: [],
  knowledgeTypes: [],
  confidentialityLevels: [],
  assets: [],
  departments: [],
  fileTypes: [],
  searchSuggestions: [],
  topSearches: [],
  communities: [],
  transferSessions: [],
  reviewQueue: [],
  needs: [],
  notifications: [],
  kpis: [],
  monthlyActivity: [],
  departmentContribution: [],
  contentHealth: [],
  topContributors: [],
  topCommunities: [],
  trainingPrograms: [],
  complianceMatrix: [],
  securityControls: [],
  roles: [],
  auditLog: [],
  features: [],
  seciLayers: [],
  workflowStages: [],
  workflowDefinitions: [],
  broadcastMessages: [],
}

export function useLocalizedData() {
  const { locale } = useLocale()
  const [data, setData] = useState<BootstrapData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/platform/data?locale=${locale}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("failed_to_load_platform_data")
        }
        return response.json() as Promise<BootstrapData>
      })
      .then((payload) => {
        if (!cancelled) setData(payload)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  return useMemo(
    () => ({
      ...data,
      loading,
      error,
      getAsset: (id: string) => data.assets.find((asset) => asset.id === id),
      getCategory: (id: string) => data.categories.find((category) => category.id === id),
      getCommunity: (id: string) =>
        (data.communities as Array<{ id: string }>).find((community) => community.id === id),
      getTransferSession: (id: string) =>
        (data.transferSessions as Array<{ id: string }>).find((session) => session.id === id),
      getNeed: (id: string) => (data.needs as Array<{ id: string }>).find((need) => need.id === id),
    }),
    [data, loading, error],
  )
}
