import { unstable_cache } from "next/cache"
import { and, asc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { lookupTranslations, lookups } from "@/lib/db/schema"
import type { Locale } from "@/i18n"
import type { LookupItem } from "@/lib/db/repositories/lookup.repository"

export type LookupCacheData = {
  labels: Record<string, string>
  groups: Record<string, LookupItem[]>
}

function labelKey(group: string, id: string) {
  return `${group}:${id}`
}

const loadLookupCache = unstable_cache(
  async (locale: Locale): Promise<LookupCacheData> => {
    const db = getDb()
    const rows = await db
      .select({
        group: lookups.group,
        id: lookups.id,
        label: lookupTranslations.label,
        description: lookupTranslations.description,
        metadata: lookups.metadata,
        sortOrder: lookups.sortOrder,
      })
      .from(lookups)
      .innerJoin(lookupTranslations, eq(lookupTranslations.lookupId, lookups.id))
      .where(and(eq(lookupTranslations.locale, locale), eq(lookups.isActive, true)))
      .orderBy(asc(lookups.sortOrder))

    const labels: Record<string, string> = {}
    const groups: Record<string, LookupItem[]> = {}

    for (const row of rows) {
      labels[labelKey(row.group, row.id)] = row.label
      const items = groups[row.group] ?? []
      items.push({
        id: row.id,
        label: row.label,
        description: row.description,
        metadata: row.metadata,
      })
      groups[row.group] = items
    }

    return { labels, groups }
  },
  ["lookup-cache"],
  { revalidate: 300, tags: ["lookups"] },
)

let requestCache: { locale: Locale; data: LookupCacheData } | null = null

export async function warmupLookupCache(locale: Locale): Promise<LookupCacheData> {
  const data = await loadLookupCache(locale)
  requestCache = { locale, data }
  return data
}

export function getRequestLookupCache(locale: Locale) {
  return requestCache?.locale === locale ? requestCache.data : null
}

export function readCachedLookupLabel(
  group: string,
  id: string,
  locale: Locale,
  data?: LookupCacheData | null,
) {
  const cache = data ?? getRequestLookupCache(locale)
  if (!cache) return null
  return cache.labels[labelKey(group, id)] ?? null
}

export function readCachedLookupGroup(group: string, locale: Locale, data?: LookupCacheData | null) {
  const cache = data ?? getRequestLookupCache(locale)
  if (!cache) return null
  return cache.groups[group] ?? null
}
