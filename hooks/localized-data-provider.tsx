"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useLocale } from "@/hooks/use-locale"
import type { KnowledgeAsset } from "@/types/domain"

type BootstrapData = {
  locale: string
  categories: Array<{ id: string; name: string; count: number; icon: string; topics: string[] }>
  knowledgeTypes: string[]
  contentTemplates: Array<{
    id: string
    name: string
    description: string
    knowledgeTypeId: string
    knowledgeType: string
  }>
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
  needUnits: Array<{ id: string; label: string; description?: string | null }>
  needPriorities: Array<{ id: string; label: string; description?: string | null }>
  transferSessionTypes: Array<{ id: string; label: string; desc: string }>
  domains: Array<{ id: string; label: string; description?: string | null }>
  transferDurations: Array<{ id: string; label: string; description?: string | null }>
  workflowStages: unknown[]
  workflowDefinitions: unknown[]
  broadcastMessages: unknown[]
}

const emptyData: BootstrapData = {
  locale: "ar",
  categories: [],
  knowledgeTypes: [],
  contentTemplates: [],
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
  needUnits: [],
  needPriorities: [],
  transferSessionTypes: [],
  domains: [],
  transferDurations: [],
  workflowStages: [],
  workflowDefinitions: [],
  broadcastMessages: [],
}

type LocalizedDataContextValue = BootstrapData & {
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getAsset: (id: string) => KnowledgeAsset | undefined
  getCategory: (id: string) => BootstrapData["categories"][number] | undefined
  getCommunity: (id: string) => { id: string } | undefined
  getTransferSession: (id: string) => { id: string } | undefined
  getNeed: (id: string) => { id: string } | undefined
}

const LocalizedDataContext = createContext<LocalizedDataContextValue | null>(null)

export function LocalizedDataProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  const [data, setData] = useState<BootstrapData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(async () => {
    setRefreshKey((value) => value + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/platform/data?locale=${locale}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("failed_to_load_platform_data")
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
  }, [locale, refreshKey])

  const value = useMemo<LocalizedDataContextValue>(
    () => ({
      ...data,
      loading,
      error,
      refresh,
      getAsset: (id: string) => data.assets.find((asset) => asset.id === id),
      getCategory: (id: string) => data.categories.find((category) => category.id === id),
      getCommunity: (id: string) =>
        (data.communities as Array<{ id: string }>).find((community) => community.id === id),
      getTransferSession: (id: string) =>
        (data.transferSessions as Array<{ id: string }>).find((session) => session.id === id),
      getNeed: (id: string) => (data.needs as Array<{ id: string }>).find((need) => need.id === id),
    }),
    [data, loading, error, refresh],
  )

  return <LocalizedDataContext.Provider value={value}>{children}</LocalizedDataContext.Provider>
}

export function useLocalizedData() {
  const ctx = useContext(LocalizedDataContext)
  if (!ctx) throw new Error("useLocalizedData must be used within LocalizedDataProvider")
  return ctx
}
