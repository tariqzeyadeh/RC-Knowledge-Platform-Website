import * as collaborationAr from "@/data/fixtures/collaboration"
import * as collaborationEn from "@/data/fixtures/locale/en/collaboration"
import { getDictionary } from "@/i18n"
import { getDb } from "@/lib/db"
import {
  communities,
  communityItems,
  communityLinkedAssets,
  communityPosts,
  knowledgeNeeds,
  lookupTranslations,
  lookups,
  reviewItems,
  transferOutputs,
  transferSessions,
  userNotifications,
} from "@/lib/db/schema"

const KNOWLEDGE_TYPE_IDS = [
  "procedure-guide",
  "lesson-learned",
  "template-form",
  "policy",
  "expertise-report",
  "meeting-minutes",
  "study-research",
] as const

const KNOWLEDGE_TYPES_AR = [
  "دليل إجرائي",
  "درس مستفاد",
  "قالب / نموذج",
  "سياسة",
  "تقرير خبرة",
  "محضر اجتماع",
  "دراسة / بحث",
]

const DOMAIN_MAP: Record<string, string> = {
  "إدارة المشاريع": "domain-projects",
  "المشتريات": "domain-procurement",
  "التقنية": "domain-digital",
  "الحوكمة": "domain-governance",
  "الاستراتيجية": "domain-strategy",
  "التحول الرقمي": "domain-digital",
  "الاتصال المؤسسي": "domain-communications",
  "الموارد البشرية": "domain-hr",
  "Project Management": "domain-projects",
  Procurement: "domain-procurement",
  Technology: "domain-digital",
  Governance: "domain-governance",
  Strategy: "domain-strategy",
  "Digital Transformation": "domain-digital",
  "Corporate Communications": "domain-communications",
  "Human Resources": "domain-hr",
}

const DEPARTMENT_MAP: Record<string, string> = {
  "إدارة التحول الرقمي": "dept-digital",
  "إدارة المشتريات": "dept-procurement",
  "التخطيط الاستراتيجي": "dept-strategy",
  "مكتب اللجان": "dept-communications",
  "الموارد البشرية": "dept-hr",
  "حوكمة البيانات": "dept-data-gov",
  "الاتصال المؤسسي": "dept-communications",
  "التحول الرقمي": "dept-digital",
  "المشتريات": "dept-procurement",
}

const SESSION_TYPE_MAP: Record<string, string> = {
  "إغلاق مشروع": "project-close",
  "خبرة خبير": "expert",
  "تسليم مهام / مغادرة": "handover",
  "أفضل ممارسة": "best-practice",
  "الدروس المستفادة": "lessons-learned",
}

const STATUS_MAP: Record<string, string> = {
  مكتملة: "tss-completed",
  مجدولة: "tss-scheduled",
  "قيد التوثيق": "tss-documenting",
  Completed: "tss-completed",
  Scheduled: "tss-scheduled",
  Documenting: "tss-documenting",
}

const DURATION_MAP: Record<string, string> = {
  "90 دقيقة": "td-m90",
  "60 دقيقة": "td-m60",
  "75 دقيقة": "td-m75",
  "45 دقيقة": "td-m45",
  "90 min": "td-m90",
  "60 min": "td-m60",
  "75 min": "td-m75",
  "45 min": "td-m45",
}

const OUTPUT_STATUS_MAP: Record<string, string> = {
  معتمد: "tos-approved",
  "قيد المراجعة": "tos-under-review",
  مسودة: "tos-draft",
  Approved: "tos-approved",
  "Under review": "tos-under-review",
  Draft: "tos-draft",
}

const REVIEW_STAGE_MAP: Record<string, string> = {
  مراجعة: "rs-review",
  اعتماد: "rs-approval",
  مسودة: "rs-draft",
  Review: "rs-review",
  Approval: "rs-approval",
  Draft: "rs-draft",
}

const REVIEW_PRIORITY_MAP: Record<string, string> = {
  عالية: "rp-high",
  متوسطة: "rp-medium",
  عادية: "rp-normal",
  High: "rp-high",
  Medium: "rp-medium",
  Normal: "rp-normal",
}

const NEED_PRIORITY_MAP: Record<string, string> = {
  عالية: "np-high",
  متوسطة: "np-medium",
  منخفضة: "np-low",
  High: "np-high",
  Medium: "np-medium",
  Low: "np-low",
}

const NEED_STATUS_MAP: Record<string, string> = {
  جديد: "ns-new",
  "قيد الإنتاج": "ns-in-production",
  منشور: "ns-published",
  New: "ns-new",
  "In production": "ns-in-production",
  Published: "ns-published",
}

const NEED_UNIT_MAP: Record<string, string> = {
  "إدارة المشتريات": "nu-procurement",
  "مكتب إدارة المشاريع": "nu-pmo",
  "التحول الرقمي": "nu-digital",
  "التخطيط الاستراتيجي": "nu-strategy",
  "الإدارة القانونية": "nu-legal",
  "Procurement Department": "nu-procurement",
  "Project Management Office": "nu-pmo",
  "Digital Transformation Department": "nu-digital",
  "Strategic Planning Department": "nu-strategy",
  "Legal Department": "nu-legal",
}

async function insertLookup(
  group: string,
  id: string,
  sortOrder: number,
  labels: { ar: string; en: string },
  metadata?: Record<string, unknown>,
) {
  const db = getDb()
  await db.insert(lookups).values({ id, group, sortOrder, isActive: true, metadata })
  await db.insert(lookupTranslations).values([
    { lookupId: id, locale: "ar", label: labels.ar },
    { lookupId: id, locale: "en", label: labels.en },
  ])
}

function resolveKnowledgeTypeId(label: string) {
  const index = KNOWLEDGE_TYPES_AR.indexOf(label)
  if (index >= 0) return KNOWLEDGE_TYPE_IDS[index]
  return KNOWLEDGE_TYPE_IDS[0]
}

export async function seedCollaborationLookups() {
  const arEnums = getDictionary("ar").enums
  const enEnums = getDictionary("en").enums

  const transferStatuses = [
    { id: "tss-completed", ar: arEnums.transferStatus.completed, en: enEnums.transferStatus.completed },
    { id: "tss-scheduled", ar: arEnums.transferStatus.scheduled, en: enEnums.transferStatus.scheduled },
    { id: "tss-documenting", ar: arEnums.transferStatus.documenting, en: enEnums.transferStatus.documenting },
  ]
  for (const [index, status] of transferStatuses.entries()) {
    await insertLookup("transfer_session_status", status.id, index, { ar: status.ar, en: status.en })
  }

  const outputStatuses = [
    { id: "tos-approved", ar: arEnums.outputStatus.approved, en: enEnums.outputStatus.approved },
    { id: "tos-under-review", ar: arEnums.outputStatus.underReview, en: enEnums.outputStatus.underReview },
    { id: "tos-draft", ar: arEnums.outputStatus.draft, en: enEnums.outputStatus.draft },
  ]
  for (const [index, status] of outputStatuses.entries()) {
    await insertLookup("transfer_output_status", status.id, index, { ar: status.ar, en: status.en })
  }

  const durations = [
    { id: "td-m45", ar: "45 دقيقة", en: "45 min" },
    { id: "td-m60", ar: "60 دقيقة", en: "60 min" },
    { id: "td-m75", ar: "75 دقيقة", en: "75 min" },
    { id: "td-m90", ar: "90 دقيقة", en: "90 min" },
  ]
  for (const [index, duration] of durations.entries()) {
    await insertLookup("transfer_duration", duration.id, index, { ar: duration.ar, en: duration.en })
  }

  const reviewStages = [
    { id: "rs-review", ar: arEnums.reviewStage.review, en: enEnums.reviewStage.review },
    { id: "rs-approval", ar: arEnums.reviewStage.approval, en: enEnums.reviewStage.approval },
    { id: "rs-draft", ar: arEnums.reviewStage.draft, en: enEnums.reviewStage.draft },
  ]
  for (const [index, stage] of reviewStages.entries()) {
    await insertLookup("review_stage", stage.id, index, { ar: stage.ar, en: stage.en })
  }

  const reviewPriorities = [
    { id: "rp-high", ar: arEnums.reviewPriority.high, en: enEnums.reviewPriority.high },
    { id: "rp-medium", ar: arEnums.reviewPriority.medium, en: enEnums.reviewPriority.medium },
    { id: "rp-normal", ar: arEnums.reviewPriority.normal, en: enEnums.reviewPriority.normal },
  ]
  for (const [index, priority] of reviewPriorities.entries()) {
    await insertLookup("review_priority", priority.id, index, { ar: priority.ar, en: priority.en })
  }

  const needPriorities = [
    { id: "np-high", key: "high" },
    { id: "np-medium", key: "medium" },
    { id: "np-low", key: "low" },
  ] as const
  for (const [index, priority] of needPriorities.entries()) {
    await insertLookup(
      "need_priority",
      priority.id,
      index,
      {
        ar: arEnums.needPriority[priority.key],
        en: enEnums.needPriority[priority.key],
      },
    )
  }

  const needStatuses = [
    { id: "ns-new", ar: "جديد", en: "New" },
    { id: "ns-in-production", ar: "قيد الإنتاج", en: "In production" },
    { id: "ns-published", ar: "منشور", en: "Published" },
  ]
  for (const [index, status] of needStatuses.entries()) {
    await insertLookup("need_status", status.id, index, { ar: status.ar, en: status.en })
  }

  const needUnits = [
    "procurement",
    "pmo",
    "digital",
    "strategy",
    "hr",
    "legal",
    "dataGov",
  ] as const
  const arPages = getDictionary("ar").pages.needs.createWizard
  const enPages = getDictionary("en").pages.needs.createWizard
  for (const [index, unit] of needUnits.entries()) {
    await insertLookup(
      "need_unit",
      `nu-${unit}`,
      index,
      {
        ar: arPages.units[unit],
        en: enPages.units[unit],
      },
    )
  }
}

export async function seedCollaborationData() {
  const db = getDb()

  for (const [index, community] of collaborationAr.communities.entries()) {
    const enCommunity = collaborationEn.communities[index]
    await db.insert(communities).values({
      id: community.id,
      nameAr: community.name,
      nameEn: enCommunity.name,
      domainId: DOMAIN_MAP[community.domain] ?? "domain-projects",
      owner: community.owner,
      descAr: community.desc,
      descEn: enCommunity.desc,
      charterAr: community.charter,
      charterEn: enCommunity.charter,
      active: community.active,
      members: community.members,
      posts: community.posts,
      createdAt: community.createdAt,
    })

    for (const [sortOrder, objective] of community.objectives.entries()) {
      await db.insert(communityItems).values({
        communityId: community.id,
        kind: "objective",
        locale: "ar",
        value: objective,
        sortOrder,
      })
      await db.insert(communityItems).values({
        communityId: community.id,
        kind: "objective",
        locale: "en",
        value: enCommunity.objectives[sortOrder],
        sortOrder,
      })
    }

    for (const [sortOrder, topic] of community.topics.entries()) {
      await db.insert(communityItems).values({
        communityId: community.id,
        kind: "topic",
        locale: "ar",
        value: topic,
        sortOrder,
      })
      await db.insert(communityItems).values({
        communityId: community.id,
        kind: "topic",
        locale: "en",
        value: enCommunity.topics[sortOrder],
        sortOrder,
      })
    }

    for (const [sortOrder, moderator] of community.moderators.entries()) {
      await db.insert(communityItems).values({
        communityId: community.id,
        kind: "moderator",
        locale: "ar",
        value: moderator,
        sortOrder,
      })
    }

    for (const assetId of community.linkedAssetIds) {
      await db.insert(communityLinkedAssets).values({ communityId: community.id, assetId })
    }

    for (const post of community.recentPosts) {
      await db.insert(communityPosts).values({
        id: post.id,
        communityId: community.id,
        title: post.title,
        author: post.author,
        date: post.date,
        replies: post.replies,
        convertedToAssetId: post.convertedToAsset,
      })
    }
  }

  for (const [index, session] of collaborationAr.transferSessions.entries()) {
    const enSession = collaborationEn.transferSessions[index]
    await db.insert(transferSessions).values({
      id: session.id,
      titleAr: session.title,
      titleEn: enSession.title,
      expert: session.expert,
      date: session.date,
      statusId: STATUS_MAP[session.status] ?? "tss-scheduled",
      domainId: DOMAIN_MAP[session.domain] ?? "domain-projects",
      departmentId: DEPARTMENT_MAP[session.department] ?? "dept-km",
      durationId: DURATION_MAP[session.duration] ?? "td-m60",
      facilitator: session.facilitator,
      sessionTypeId: SESSION_TYPE_MAP[session.sessionType] ?? "expert",
      attendees: session.attendees,
      agenda: session.agenda,
      keyQuestions: session.keyQuestions,
      summaryAr: session.summary,
      summaryEn: enSession.summary,
      nextStepsAr: session.nextSteps,
      nextStepsEn: enSession.nextSteps,
      outputsCount: session.outputs,
      createdAt: session.date,
    })

    for (const output of session.documentedOutputs) {
      await db.insert(transferOutputs).values({
        id: output.id,
        sessionId: session.id,
        title: output.title,
        type: output.type,
        statusId: OUTPUT_STATUS_MAP[output.status] ?? "tos-draft",
        assetId: output.assetId,
      })
    }
  }

  for (const item of collaborationAr.reviewQueue) {
    await db.insert(reviewItems).values({
      id: item.id,
      title: item.title,
      knowledgeTypeId: resolveKnowledgeTypeId(item.type),
      submittedBy: item.submittedBy,
      departmentId: DEPARTMENT_MAP[item.department] ?? "dept-km",
      submittedAt: item.submittedAt,
      stageId: REVIEW_STAGE_MAP[item.stage] ?? "rs-review",
      sla: item.sla,
      priorityId: REVIEW_PRIORITY_MAP[item.priority] ?? "rp-normal",
    })
  }

  for (const [index, need] of collaborationAr.needs.entries()) {
    const enNeed = collaborationEn.needs[index]
    await db.insert(knowledgeNeeds).values({
      id: need.id,
      titleAr: need.title,
      titleEn: enNeed.title,
      unitId: NEED_UNIT_MAP[need.unit] ?? "nu-pmo",
      priorityId: NEED_PRIORITY_MAP[need.priority] ?? "np-medium",
      statusId: NEED_STATUS_MAP[need.status] ?? "ns-new",
      votes: need.votes,
      assignedTo: need.assignedTo,
      requestedBy: need.requestedBy,
      requestedAt: need.requestedAt,
      descriptionAr: need.description,
      descriptionEn: enNeed.description,
      justificationAr: need.justification,
      justificationEn: enNeed.justification,
      expectedOutcomeAr: need.expectedOutcome,
      expectedOutcomeEn: enNeed.expectedOutcome,
      timeline: need.timeline,
      linkedAssetId: need.linkedAssetId,
    })
  }

  for (const notification of collaborationAr.notifications) {
    await db.insert(userNotifications).values({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.desc,
      timeLabel: notification.time,
      unread: notification.unread,
      createdAt: new Date().toISOString(),
    })
  }
}

export async function clearCollaborationTables() {
  const db = getDb()
  await db.delete(userNotifications)
  await db.delete(transferOutputs)
  await db.delete(transferSessions)
  await db.delete(reviewItems)
  await db.delete(knowledgeNeeds)
  await db.delete(communityPosts)
  await db.delete(communityMembers)
  await db.delete(communityLinkedAssets)
  await db.delete(communityItems)
  await db.delete(communities)
}
