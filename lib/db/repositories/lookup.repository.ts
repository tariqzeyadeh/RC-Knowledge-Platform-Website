import { and, asc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { categoryTopics, lookupTranslations, lookups } from "@/lib/db/schema"
import type { Locale } from "@/i18n"
import type { Category } from "@/types/domain"

export type LookupItem = {
  id: string
  label: string
  description?: string | null
  metadata?: Record<string, unknown> | null
}

export async function listLookups(group: string, locale: Locale): Promise<LookupItem[]> {
  const db = getDb()
  const rows = await db
    .select({
      id: lookups.id,
      label: lookupTranslations.label,
      description: lookupTranslations.description,
      metadata: lookups.metadata,
      sortOrder: lookups.sortOrder,
    })
    .from(lookups)
    .innerJoin(lookupTranslations, eq(lookupTranslations.lookupId, lookups.id))
    .where(and(eq(lookups.group, group), eq(lookupTranslations.locale, locale), eq(lookups.isActive, true)))
    .orderBy(asc(lookups.sortOrder))

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    description: row.description,
    metadata: row.metadata,
  }))
}

export async function getLookupLabel(group: string, id: string, locale: Locale) {
  const db = getDb()
  const row = await db
    .select({ label: lookupTranslations.label })
    .from(lookups)
    .innerJoin(lookupTranslations, eq(lookupTranslations.lookupId, lookups.id))
    .where(
      and(
        eq(lookups.group, group),
        eq(lookups.id, id),
        eq(lookupTranslations.locale, locale),
      ),
    )
    .get()

  return row?.label ?? id
}

export async function listCategories(locale: Locale): Promise<Category[]> {
  const db = getDb()
  const categoryRows = await listLookups("category", locale)
  const topics = await db
    .select()
    .from(categoryTopics)
    .where(eq(categoryTopics.locale, locale))
    .orderBy(asc(categoryTopics.sortOrder))

  const topicsByCategory = new Map<string, string[]>()
  for (const topic of topics) {
    const list = topicsByCategory.get(topic.categoryId) ?? []
    list.push(topic.topic)
    topicsByCategory.set(topic.categoryId, list)
  }

  return categoryRows.map((category) => ({
    id: category.id,
    name: category.label,
    count: Number(category.metadata?.count ?? 0),
    icon: String(category.metadata?.icon ?? "Folder"),
    topics: topicsByCategory.get(category.id) ?? [],
  }))
}

export async function listKnowledgeTypeLabels(locale: Locale) {
  const items = await listLookups("knowledge_type", locale)
  return items.map((item) => item.label)
}

export async function listConfidentialityLevels(locale: Locale) {
  const items = await listLookups("confidentiality", locale)
  return items.map((item) => ({
    id: item.id,
    name: item.label,
    color: String(item.metadata?.color ?? "sky"),
  }))
}

export async function listLookupGroups() {
  const db = getDb()
  const rows = await db.select({ group: lookups.group }).from(lookups)
  return [...new Set(rows.map((row) => row.group))].sort()
}

export async function resolveLookupIdByLabel(group: string, label: string, locale: Locale) {
  const items = await listLookups(group, locale)
  const match = items.find((item) => item.label === label)
  return match?.id
}
