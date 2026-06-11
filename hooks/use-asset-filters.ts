"use client"

import { useMemo, useState } from "react"
import { useLocale } from "@/hooks/use-locale"
import { filterAssets } from "@/services/knowledge/asset-filter.service"

export function useAssetFilters(initialCategoryId = "all") {
  const { locale } = useLocale()
  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [type, setType] = useState("all")
  const [confidentiality, setConfidentiality] = useState("all")

  const results = useMemo(
    () => filterAssets({ query, categoryId, type, confidentiality }, locale),
    [query, categoryId, type, confidentiality, locale],
  )

  return {
    query,
    setQuery,
    categoryId,
    setCategoryId,
    type,
    setType,
    confidentiality,
    setConfidentiality,
    results,
  }
}
