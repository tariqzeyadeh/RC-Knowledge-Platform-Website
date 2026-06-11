"use client"

import { useMemo, useState } from "react"
import { useLocale } from "@/hooks/use-locale"
import { searchAssets } from "@/services/knowledge/asset-search.service"
import type { AssetSort } from "@/types/domain"

export function useAssetSearch(initialSort: AssetSort = "relevance") {
  const { locale } = useLocale()
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<AssetSort>(initialSort)

  const results = useMemo(() => searchAssets(query, sort, locale), [query, sort, locale])

  return { query, setQuery, sort, setSort, results }
}
