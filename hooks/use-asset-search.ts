"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/hooks/use-locale"
import { searchAssets } from "@/services/knowledge/asset-search.service"
import type { AssetSort } from "@/types/domain"

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

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const results = useMemo(
    () =>
      searchAssets(
        { query, categoryId, type, department, fileType, dateFrom, dateTo },
        sort,
        locale,
      ),
    [query, categoryId, type, department, fileType, dateFrom, dateTo, sort, locale],
  )

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
  }
}
