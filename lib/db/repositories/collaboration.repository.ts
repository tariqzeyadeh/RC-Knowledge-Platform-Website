import { and, asc, desc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import {
  communities,
  communityItems,
  communityLinkedAssets,
  communityPosts,
  knowledgeNeeds,
  reviewItems,
  transferOutputs,
  transferSessions,
  userNotifications,
} from "@/lib/db/schema"
import { getLookupLabel } from "@/lib/db/repositories/lookup.repository"
import { resolveCommunityDomainLabel } from "@/lib/db/repositories/catalog.repository"
import type { Locale } from "@/i18n"
import type {
  Community,
  KnowledgeNeed,
  Notification,
  ReviewItem,
  TransferOutput,
  TransferSession,
} from "@/types/domain"

async function mapCommunity(
  row: typeof communities.$inferSelect,
  locale: Locale,
): Promise<Community> {
  const db = getDb()
  const items = await db
    .select()
    .from(communityItems)
    .where(and(eq(communityItems.communityId, row.id), eq(communityItems.locale, locale)))
    .orderBy(asc(communityItems.sortOrder))

  const linked = await db
    .select()
    .from(communityLinkedAssets)
    .where(eq(communityLinkedAssets.communityId, row.id))

  const posts = await db
    .select()
    .from(communityPosts)
    .where(eq(communityPosts.communityId, row.id))
    .orderBy(desc(communityPosts.date))

  return {
    id: row.id,
    name: locale === "en" && row.nameEn ? row.nameEn : row.nameAr,
    members: row.members,
    posts: row.posts,
    domain: await resolveCommunityDomainLabel(row.domainId, locale),
    owner: row.owner,
    desc: locale === "en" && row.descEn ? row.descEn : row.descAr,
    active: row.active,
    createdAt: row.createdAt,
    objectives: items.filter((item) => item.kind === "objective").map((item) => item.value),
    topics: items.filter((item) => item.kind === "topic").map((item) => item.value),
    moderators: items.filter((item) => item.kind === "moderator").map((item) => item.value),
    charter: locale === "en" && row.charterEn ? row.charterEn : row.charterAr,
    linkedAssetIds: linked.map((item) => item.assetId),
    recentPosts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      author: post.author,
      date: post.date,
      replies: post.replies,
      convertedToAsset: post.convertedToAssetId ?? undefined,
    })),
  }
}

export async function listCommunities(locale: Locale = "ar"): Promise<Community[]> {
  const db = getDb()
  const rows = await db.select().from(communities).orderBy(desc(communities.createdAt))
  return Promise.all(rows.map((row) => mapCommunity(row, locale)))
}

export async function getCommunity(id: string, locale: Locale = "ar") {
  const db = getDb()
  const row = await db.select().from(communities).where(eq(communities.id, id)).get()
  if (!row) return null
  return mapCommunity(row, locale)
}

export async function createCommunity(
  data: {
    id: string
    nameAr: string
    nameEn?: string
    domainId: string
    owner: string
    descAr: string
    descEn?: string
    charterAr: string
    charterEn?: string
    objectivesAr: string[]
    objectivesEn?: string[]
    topicsAr: string[]
    topicsEn?: string[]
    moderators: string[]
  },
  locale: Locale = "ar",
) {
  const db = getDb()
  const now = new Date().toISOString().slice(0, 10)

  await db.insert(communities).values({
    id: data.id,
    nameAr: data.nameAr,
    nameEn: data.nameEn,
    domainId: data.domainId,
    owner: data.owner,
    descAr: data.descAr,
    descEn: data.descEn,
    charterAr: data.charterAr,
    charterEn: data.charterEn,
    active: true,
    members: 1,
    posts: 0,
    createdAt: now,
  })

  const itemRows = [
    ...data.objectivesAr.map((value, index) => ({
      communityId: data.id,
      kind: "objective",
      locale: "ar" as const,
      value,
      sortOrder: index,
    })),
    ...(data.objectivesEn ?? []).map((value, index) => ({
      communityId: data.id,
      kind: "objective",
      locale: "en" as const,
      value,
      sortOrder: index,
    })),
    ...data.topicsAr.map((value, index) => ({
      communityId: data.id,
      kind: "topic",
      locale: "ar" as const,
      value,
      sortOrder: index,
    })),
    ...(data.topicsEn ?? []).map((value, index) => ({
      communityId: data.id,
      kind: "topic",
      locale: "en" as const,
      value,
      sortOrder: index,
    })),
    ...data.moderators.map((value, index) => ({
      communityId: data.id,
      kind: "moderator",
      locale: "ar" as const,
      value,
      sortOrder: index,
    })),
  ]

  if (itemRows.length > 0) {
    await db.insert(communityItems).values(itemRows)
  }

  return getCommunity(data.id, locale)
}

async function mapTransferOutput(
  row: typeof transferOutputs.$inferSelect,
  locale: Locale,
): Promise<TransferOutput> {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: (await getLookupLabel("transfer_output_status", row.statusId, locale)) as TransferOutput["status"],
    assetId: row.assetId ?? undefined,
  }
}

async function mapTransferSession(
  row: typeof transferSessions.$inferSelect,
  locale: Locale,
): Promise<TransferSession> {
  const db = getDb()
  const outputs = await db
    .select()
    .from(transferOutputs)
    .where(eq(transferOutputs.sessionId, row.id))

  return {
    id: row.id,
    title: locale === "en" && row.titleEn ? row.titleEn : row.titleAr,
    expert: row.expert,
    date: row.date,
    status: (await getLookupLabel("transfer_session_status", row.statusId, locale)) as TransferSession["status"],
    outputs: row.outputsCount,
    domain: await getLookupLabel("domain", row.domainId, locale),
    department: await getLookupLabel("department", row.departmentId, locale),
    duration: await getLookupLabel("transfer_duration", row.durationId, locale),
    facilitator: row.facilitator,
    sessionType: await getLookupLabel("transfer_session_type", row.sessionTypeId, locale),
    attendees: row.attendees,
    agenda: row.agenda,
    keyQuestions: row.keyQuestions,
    documentedOutputs: await Promise.all(outputs.map((output) => mapTransferOutput(output, locale))),
    summary: locale === "en" && row.summaryEn ? row.summaryEn : row.summaryAr,
    nextSteps:
      locale === "en" && row.nextStepsEn
        ? row.nextStepsEn
        : row.nextStepsAr ?? undefined,
  }
}

export async function listTransferSessions(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(transferSessions).orderBy(desc(transferSessions.date))
  return Promise.all(rows.map((row) => mapTransferSession(row, locale)))
}

export async function getTransferSession(id: string, locale: Locale = "ar") {
  const db = getDb()
  const row = await db.select().from(transferSessions).where(eq(transferSessions.id, id)).get()
  if (!row) return null
  return mapTransferSession(row, locale)
}

export async function createTransferSession(
  data: {
    id: string
    titleAr: string
    titleEn?: string
    expert: string
    date: string
    statusId: string
    domainId: string
    departmentId: string
    durationId: string
    facilitator: string
    sessionTypeId: string
    attendees: number
    agenda: string[]
    keyQuestions?: string[]
    summaryAr: string
    summaryEn?: string
    nextStepsAr?: string
    nextStepsEn?: string
  },
  locale: Locale = "ar",
) {
  const db = getDb()
  await db.insert(transferSessions).values({
    ...data,
    keyQuestions: data.keyQuestions ?? [],
    outputsCount: 0,
    createdAt: new Date().toISOString(),
  })
  return getTransferSession(data.id, locale)
}

async function mapReviewItem(row: typeof reviewItems.$inferSelect, locale: Locale): Promise<ReviewItem> {
  return {
    id: row.id,
    title: row.title,
    type: row.knowledgeTypeId
      ? await getLookupLabel("knowledge_type", row.knowledgeTypeId, locale)
      : "—",
    submittedBy: row.submittedBy,
    department: await getLookupLabel("department", row.departmentId, locale),
    submittedAt: row.submittedAt,
    stage: (await getLookupLabel("review_stage", row.stageId, locale)) as ReviewItem["stage"],
    sla: row.sla,
    priority: (await getLookupLabel("review_priority", row.priorityId, locale)) as ReviewItem["priority"],
    assetId: row.assetId ?? undefined,
  }
}

export async function listReviewQueue(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db
    .select()
    .from(reviewItems)
    .where(eq(reviewItems.stageId, "rs-review"))
    .orderBy(desc(reviewItems.submittedAt))
  return Promise.all(rows.map((row) => mapReviewItem(row, locale)))
}

export async function updateReviewStage(id: string, stageId: string, locale: Locale = "ar") {
  const db = getDb()
  await db.update(reviewItems).set({ stageId }).where(eq(reviewItems.id, id))
  const row = await db.select().from(reviewItems).where(eq(reviewItems.id, id)).get()
  if (!row) return null
  return mapReviewItem(row, locale)
}

async function mapNeed(row: typeof knowledgeNeeds.$inferSelect, locale: Locale): Promise<KnowledgeNeed> {
  return {
    id: row.id,
    title: locale === "en" && row.titleEn ? row.titleEn : row.titleAr,
    unit: await getLookupLabel("need_unit", row.unitId, locale),
    priority: (await getLookupLabel("need_priority", row.priorityId, locale)) as KnowledgeNeed["priority"],
    status: (await getLookupLabel("need_status", row.statusId, locale)) as KnowledgeNeed["status"],
    votes: row.votes,
    assignedTo: row.assignedTo,
    requestedBy: row.requestedBy,
    requestedAt: row.requestedAt,
    description: locale === "en" && row.descriptionEn ? row.descriptionEn : row.descriptionAr,
    justification: locale === "en" && row.justificationEn ? row.justificationEn : row.justificationAr,
    expectedOutcome:
      locale === "en" && row.expectedOutcomeEn ? row.expectedOutcomeEn : row.expectedOutcomeAr,
    timeline: row.timeline ?? undefined,
    linkedAssetId: row.linkedAssetId ?? undefined,
  }
}

export async function listNeeds(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(knowledgeNeeds).orderBy(desc(knowledgeNeeds.requestedAt))
  return Promise.all(rows.map((row) => mapNeed(row, locale)))
}

export async function getNeed(id: string, locale: Locale = "ar") {
  const db = getDb()
  const row = await db.select().from(knowledgeNeeds).where(eq(knowledgeNeeds.id, id)).get()
  if (!row) return null
  return mapNeed(row, locale)
}

export async function createNeed(
  data: {
    id: string
    titleAr: string
    titleEn?: string
    unitId: string
    priorityId: string
    descriptionAr: string
    descriptionEn?: string
    justificationAr: string
    justificationEn?: string
    expectedOutcomeAr: string
    expectedOutcomeEn?: string
    requestedBy: string
  },
  locale: Locale = "ar",
) {
  const db = getDb()
  const today = new Date().toISOString().slice(0, 10)
  await db.insert(knowledgeNeeds).values({
    id: data.id,
    titleAr: data.titleAr,
    titleEn: data.titleEn,
    unitId: data.unitId,
    priorityId: data.priorityId,
    statusId: "ns-new",
    votes: 0,
    assignedTo: "—",
    requestedBy: data.requestedBy,
    requestedAt: today,
    descriptionAr: data.descriptionAr,
    descriptionEn: data.descriptionEn,
    justificationAr: data.justificationAr,
    justificationEn: data.justificationEn,
    expectedOutcomeAr: data.expectedOutcomeAr,
    expectedOutcomeEn: data.expectedOutcomeEn,
  })
  return getNeed(data.id, locale)
}

export async function voteNeed(id: string, locale: Locale = "ar") {
  const db = getDb()
  const row = await db.select().from(knowledgeNeeds).where(eq(knowledgeNeeds.id, id)).get()
  if (!row) return null
  await db
    .update(knowledgeNeeds)
    .set({ votes: row.votes + 1 })
    .where(eq(knowledgeNeeds.id, id))
  return getNeed(id, locale)
}

export async function listNotifications(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(userNotifications).orderBy(desc(userNotifications.createdAt))
  return rows.map(
    (row) =>
      ({
        id: row.id,
        type: row.type,
        title: row.title,
        desc: row.body,
        time: row.timeLabel,
        unread: row.unread,
      }) satisfies Notification,
  )
}

export async function markAllNotificationsRead() {
  const db = getDb()
  await db.update(userNotifications).set({ unread: false })
}
