import { and, asc, desc, eq, inArray } from "drizzle-orm"
import { getDb } from "@/lib/db"
import {
  communities,
  communityItems,
  communityLinkedAssets,
  communityMembers,
  communityPosts,
  knowledgeNeeds,
  reviewItems,
  transferOutputs,
  transferSessions,
  userNotifications,
} from "@/lib/db/schema"
import { getLookupLabel } from "@/lib/db/repositories/lookup.repository"
import { readCachedLookupLabel } from "@/lib/db/repositories/lookup-cache"
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

async function resolveLabel(group: string, id: string, locale: Locale) {
  return readCachedLookupLabel(group, id, locale) ?? (await getLookupLabel(group, id, locale))
}

function mapCommunityRow(
  row: typeof communities.$inferSelect,
  locale: Locale,
  items: Array<typeof communityItems.$inferSelect>,
  linked: Array<typeof communityLinkedAssets.$inferSelect>,
  posts: Array<typeof communityPosts.$inferSelect>,
  domainLabel: string,
  isMember = false,
): Community {
  return {
    id: row.id,
    name: locale === "en" && row.nameEn ? row.nameEn : row.nameAr,
    members: row.members,
    posts: row.posts,
    domain: domainLabel,
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
    isMember,
  }
}

type CommunityViewer = {
  username: string
  displayName: string
}

async function isCommunityMember(
  communityId: string,
  user: CommunityViewer,
  community: Pick<Community, "owner" | "moderators">,
) {
  if (user.displayName === community.owner) return true
  if (community.moderators.includes(user.displayName)) return true

  const db = getDb()
  const row = await db
    .select()
    .from(communityMembers)
    .where(and(eq(communityMembers.communityId, communityId), eq(communityMembers.username, user.username)))
    .get()
  return Boolean(row)
}

async function mapCommunity(
  row: typeof communities.$inferSelect,
  locale: Locale,
  user?: CommunityViewer | null,
): Promise<Community> {
  const db = getDb()
  const [items, linked, posts] = await Promise.all([
    db
      .select()
      .from(communityItems)
      .where(and(eq(communityItems.communityId, row.id), eq(communityItems.locale, locale)))
      .orderBy(asc(communityItems.sortOrder)),
    db.select().from(communityLinkedAssets).where(eq(communityLinkedAssets.communityId, row.id)),
    db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.communityId, row.id))
      .orderBy(desc(communityPosts.date)),
  ])

  const domainLabel =
    readCachedLookupLabel("domain", row.domainId, locale) ??
    (await resolveCommunityDomainLabel(row.domainId, locale))

  const base = mapCommunityRow(row, locale, items, linked, posts, domainLabel)
  if (!user) return base

  const member = await isCommunityMember(row.id, user, base)
  return { ...base, isMember: member }
}

export async function listCommunities(locale: Locale = "ar"): Promise<Community[]> {
  const db = getDb()
  const rows = await db.select().from(communities).orderBy(desc(communities.createdAt))
  if (rows.length === 0) return []

  const ids = rows.map((row) => row.id)
  const [allItems, allLinked, allPosts] = await Promise.all([
    db
      .select()
      .from(communityItems)
      .where(and(inArray(communityItems.communityId, ids), eq(communityItems.locale, locale)))
      .orderBy(asc(communityItems.sortOrder)),
    db.select().from(communityLinkedAssets).where(inArray(communityLinkedAssets.communityId, ids)),
    db
      .select()
      .from(communityPosts)
      .where(inArray(communityPosts.communityId, ids))
      .orderBy(desc(communityPosts.date)),
  ])

  const itemsByCommunity = new Map<string, Array<typeof communityItems.$inferSelect>>()
  for (const item of allItems) {
    const list = itemsByCommunity.get(item.communityId) ?? []
    list.push(item)
    itemsByCommunity.set(item.communityId, list)
  }

  const linkedByCommunity = new Map<string, Array<typeof communityLinkedAssets.$inferSelect>>()
  for (const item of allLinked) {
    const list = linkedByCommunity.get(item.communityId) ?? []
    list.push(item)
    linkedByCommunity.set(item.communityId, list)
  }

  const postsByCommunity = new Map<string, Array<typeof communityPosts.$inferSelect>>()
  for (const post of allPosts) {
    const list = postsByCommunity.get(post.communityId) ?? []
    list.push(post)
    postsByCommunity.set(post.communityId, list)
  }

  return rows.map((row) => {
    const domainLabel =
      readCachedLookupLabel("domain", row.domainId, locale) ??
      readCachedLookupLabel("category", row.domainId, locale) ??
      row.domainId

    return mapCommunityRow(
      row,
      locale,
      itemsByCommunity.get(row.id) ?? [],
      linkedByCommunity.get(row.id) ?? [],
      postsByCommunity.get(row.id) ?? [],
      domainLabel,
    )
  })
}

export async function getCommunity(
  id: string,
  locale: Locale = "ar",
  user?: CommunityViewer | null,
) {
  const db = getDb()
  const row = await db.select().from(communities).where(eq(communities.id, id)).get()
  if (!row) return null
  return mapCommunity(row, locale, user)
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
    creatorUsername: string
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

  await db.insert(communityMembers).values({
    communityId: data.id,
    username: data.creatorUsername,
    joinedAt: new Date().toISOString(),
  })

  return getCommunity(data.id, locale, {
    username: data.creatorUsername,
    displayName: data.owner,
  })
}

async function mapTransferOutput(
  row: typeof transferOutputs.$inferSelect,
  locale: Locale,
): Promise<TransferOutput> {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: (await resolveLabel("transfer_output_status", row.statusId, locale)) as TransferOutput["status"],
    assetId: row.assetId ?? undefined,
  }
}

function mapTransferSessionRow(
  row: typeof transferSessions.$inferSelect,
  locale: Locale,
  outputs: Array<typeof transferOutputs.$inferSelect>,
  labels: {
    status: string
    domain: string
    department: string
    duration: string
    sessionType: string
    documentedOutputs: TransferOutput[]
  },
): TransferSession {
  return {
    id: row.id,
    title: locale === "en" && row.titleEn ? row.titleEn : row.titleAr,
    expert: row.expert,
    date: row.date,
    status: labels.status as TransferSession["status"],
    outputs: row.outputsCount,
    domain: labels.domain,
    department: labels.department,
    duration: labels.duration,
    facilitator: row.facilitator,
    sessionType: labels.sessionType,
    attendees: row.attendees,
    agenda: row.agenda,
    keyQuestions: row.keyQuestions,
    documentedOutputs: labels.documentedOutputs,
    summary: locale === "en" && row.summaryEn ? row.summaryEn : row.summaryAr,
    nextSteps:
      locale === "en" && row.nextStepsEn
        ? row.nextStepsEn
        : row.nextStepsAr ?? undefined,
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

  return mapTransferSessionRow(row, locale, outputs, {
    status: await resolveLabel("transfer_session_status", row.statusId, locale),
    domain: await resolveLabel("domain", row.domainId, locale),
    department: await resolveLabel("department", row.departmentId, locale),
    duration: await resolveLabel("transfer_duration", row.durationId, locale),
    sessionType: await resolveLabel("transfer_session_type", row.sessionTypeId, locale),
    documentedOutputs: await Promise.all(outputs.map((output) => mapTransferOutput(output, locale))),
  })
}

export async function listTransferSessions(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(transferSessions).orderBy(desc(transferSessions.date))
  if (rows.length === 0) return []

  const sessionIds = rows.map((row) => row.id)
  const allOutputs = await db
    .select()
    .from(transferOutputs)
    .where(inArray(transferOutputs.sessionId, sessionIds))

  const outputsBySession = new Map<string, Array<typeof transferOutputs.$inferSelect>>()
  for (const output of allOutputs) {
    const list = outputsBySession.get(output.sessionId) ?? []
    list.push(output)
    outputsBySession.set(output.sessionId, list)
  }

  return Promise.all(
    rows.map(async (row) => {
      const outputs = outputsBySession.get(row.id) ?? []
      return mapTransferSessionRow(row, locale, outputs, {
        status: await resolveLabel("transfer_session_status", row.statusId, locale),
        domain: await resolveLabel("domain", row.domainId, locale),
        department: await resolveLabel("department", row.departmentId, locale),
        duration: await resolveLabel("transfer_duration", row.durationId, locale),
        sessionType: await resolveLabel("transfer_session_type", row.sessionTypeId, locale),
        documentedOutputs: await Promise.all(outputs.map((output) => mapTransferOutput(output, locale))),
      })
    }),
  )
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
      ? await resolveLabel("knowledge_type", row.knowledgeTypeId, locale)
      : "—",
    submittedBy: row.submittedBy,
    department: await resolveLabel("department", row.departmentId, locale),
    submittedAt: row.submittedAt,
    stage: (await resolveLabel("review_stage", row.stageId, locale)) as ReviewItem["stage"],
    sla: row.sla,
    priority: (await resolveLabel("review_priority", row.priorityId, locale)) as ReviewItem["priority"],
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
    unit: await resolveLabel("need_unit", row.unitId, locale),
    priority: (await resolveLabel("need_priority", row.priorityId, locale)) as KnowledgeNeed["priority"],
    status: (await resolveLabel("need_status", row.statusId, locale)) as KnowledgeNeed["status"],
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

export async function joinCommunity(
  id: string,
  user: CommunityViewer,
  locale: Locale = "ar",
) {
  const existing = await getCommunity(id, locale, user)
  if (!existing) return null
  if (existing.isMember) return existing

  const db = getDb()
  const row = await db.select().from(communities).where(eq(communities.id, id)).get()
  if (!row) return null

  await db.insert(communityMembers).values({
    communityId: id,
    username: user.username,
    joinedAt: new Date().toISOString(),
  })
  await db
    .update(communities)
    .set({ members: row.members + 1 })
    .where(eq(communities.id, id))

  return getCommunity(id, locale, user)
}

export async function createCommunityPost(
  communityId: string,
  data: { title: string; author: string },
  locale: Locale = "ar",
) {
  const db = getDb()
  const row = await db.select().from(communities).where(eq(communities.id, communityId)).get()
  if (!row) return null

  const postId = `CP-${Date.now()}`
  const today = new Date().toISOString().slice(0, 10)
  await db.insert(communityPosts).values({
    id: postId,
    communityId,
    title: data.title,
    author: data.author,
    date: today,
    replies: 0,
  })
  await db
    .update(communities)
    .set({ posts: row.posts + 1 })
    .where(eq(communities.id, communityId))

  return getCommunity(communityId, locale)
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
