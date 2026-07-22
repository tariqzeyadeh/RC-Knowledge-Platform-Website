import { count, eq, sql } from "drizzle-orm"
import { getDb } from "@/lib/db"
import {
  communities,
  knowledgeAssets,
  knowledgeNeeds,
  reviewItems,
  searchLog,
  users,
} from "@/lib/db/schema"
import type { Locale } from "@/i18n"
import { listAssets } from "@/lib/db/repositories/asset.repository"
import { listCommunities } from "@/lib/db/repositories/collaboration.repository"

export async function getAnalyticsKpis(locale: Locale) {
  const db = getDb()
  const [publishedAssets, activeUsers, pendingReview, searchRows] = await Promise.all([
    db
      .select({ value: count() })
      .from(knowledgeAssets)
      .where(eq(knowledgeAssets.status, "published"))
      .get(),
    db
      .select({ value: count() })
      .from(users)
      .where(eq(users.status, "active"))
      .get(),
    db
      .select({ value: count() })
      .from(reviewItems)
      .where(sql`${reviewItems.stageId} != 'rs-draft'`)
      .get(),
    db.select().from(searchLog).limit(500),
  ])

  const totalSearches = searchRows.length
  const successfulSearches = searchRows.filter((row) => row.resultCount > 0).length
  const searchSuccessRate =
    totalSearches > 0 ? Math.round((successfulSearches / totalSearches) * 100) : 92

  const labels =
    locale === "en"
      ? {
          published: "Published knowledge assets",
          search: "Successful search rate",
          users: "Active users",
          review: "Pending review",
        }
      : {
          published: "أصول معرفية منشورة",
          search: "معدل البحث الناجح",
          users: "مستخدمون نشطون",
          review: "بانتظار المراجعة",
        }

  return [
    {
      label: labels.published,
      value: String(publishedAssets?.value ?? 0),
      trend: "+8.4%",
      up: true,
      icon: "Library",
    },
    {
      label: labels.search,
      value: `${searchSuccessRate}%`,
      trend: "+3.1%",
      up: true,
      icon: "Search",
    },
    {
      label: labels.users,
      value: String(activeUsers?.value ?? 0),
      trend: "+12%",
      up: true,
      icon: "Users",
    },
    {
      label: labels.review,
      value: String(pendingReview?.value ?? 0),
      trend: "-5",
      up: false,
      icon: "ClipboardCheck",
    },
  ]
}

export async function getDepartmentContribution(locale: Locale) {
  const assets = await listAssets(locale)
  const totals = new Map<string, number>()

  for (const asset of assets) {
    totals.set(asset.department, (totals.get(asset.department) ?? 0) + 1)
  }

  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export async function getContentHealth(locale: Locale) {
  const db = getDb()
  const rows = await db.select().from(knowledgeAssets)
  const updated = rows.filter((row) => row.status === "published").length
  const review = rows.filter((row) => row.status === "review").length
  const draft = rows.filter((row) => row.status === "draft").length

  const labels =
    locale === "en"
      ? { updated: "Up to date", review: "Needs review", stale: "Out of date" }
      : { updated: "محدّث", review: "يحتاج مراجعة", stale: "غير محدّث" }

  return [
    { name: labels.updated, value: updated, color: "var(--chart-1)" },
    { name: labels.review, value: review, color: "var(--chart-2)" },
    { name: labels.stale, value: draft, color: "var(--chart-3)" },
  ]
}

export async function getTopCommunities(locale: Locale) {
  const rows = await listCommunities(locale)
  return rows
    .map((community) => ({
      name: community.name,
      members: community.members,
      posts: community.posts,
      assets: community.linkedAssetIds.length,
    }))
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 5)
}

export async function getNeedsStatusSummary() {
  const db = getDb()
  const rows = await db.select().from(knowledgeNeeds)
  return {
    total: rows.length,
    newCount: rows.filter((row) => row.statusId === "ns-new").length,
    inProduction: rows.filter((row) => row.statusId === "ns-in-production").length,
    published: rows.filter((row) => row.statusId === "ns-published").length,
  }
}

export async function getCommunityCount() {
  const db = getDb()
  const row = await db.select({ value: count() }).from(communities).get()
  return row?.value ?? 0
}
