"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/hooks/use-locale"
import type { AssetSort, KnowledgeAsset } from "@/types/domain"

export function useAssetSearch(initialSort: AssetSort = "relevance") {
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(urlQuery)
  const [sort, setSort] = useState<AssetSort>(initialSort)
  const [categoryId, setCategoryId] = useState("all")
  const [type, setType] = useState("all")
  const [department, setDepartment] = useState("all")
  const [fileType, setFileType] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [results, setResults] = useState<KnowledgeAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    const params = new URLSearchParams({ locale, sort })
    if (query) params.set("q", query)
    if (categoryId !== "all") params.set("categoryId", categoryId)
    if (type !== "all") params.set("type", type)
    if (department !== "all") params.set("department", department)
    if (fileType !== "all") params.set("fileType", fileType)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)

    setLoading(true)
    fetch(`/api/assets?${params.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("search_failed")
        return response.json() as Promise<{ assets: KnowledgeAsset[] }>
      })
      .then((payload) => setResults(payload.assets))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query, categoryId, type, department, fileType, dateFrom, dateTo, sort, locale])

  const hasActiveFilters =
    categoryId !== "all" ||
    type !== "all" ||
    department !== "all" ||
    fileType !== "all" ||
    Boolean(dateFrom) ||
    Boolean(dateTo)

  function clearFilters() {
    setCategoryId("all")
    setType("all")
    setDepartment("all")
    setFileType("all")
    setDateFrom("")
    setDateTo("")
  }

  return {
    query,
    setQuery,
    sort,
    setSort,
    categoryId,
    setCategoryId,
    type,
    setType,
    department,
    setDepartment,
    fileType,
    setFileType,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    hasActiveFilters,
    clearFilters,
    results,
    loading,
  }
}
