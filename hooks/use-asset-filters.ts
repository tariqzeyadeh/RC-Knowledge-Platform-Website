"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocale } from "@/hooks/use-locale"
import type { KnowledgeAsset } from "@/types/domain"

export function useAssetFilters(initialCategoryId = "all") {
  const { locale } = useLocale()
  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [type, setType] = useState("all")
  const [confidentiality, setConfidentiality] = useState("all")
  const [results, setResults] = useState<KnowledgeAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({ locale })
    if (query) params.set("q", query)
    if (categoryId !== "all") params.set("categoryId", categoryId)
    if (type !== "all") params.set("type", type)
    if (confidentiality !== "all") params.set("confidentiality", confidentiality)

    setLoading(true)
    fetch(`/api/assets?${params.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("library_failed")
        return response.json() as Promise<{ assets: KnowledgeAsset[] }>
      })
      .then((payload) => setResults(payload.assets))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query, categoryId, type, confidentiality, locale])

  return useMemo(
    () => ({
      query,
      setQuery,
      categoryId,
      setCategoryId,
      type,
      setType,
      confidentiality,
      setConfidentiality,
      results,
      loading,
    }),
    [query, categoryId, type, confidentiality, results, loading],
  )
}
