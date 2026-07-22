import "dotenv/config"
import bcrypt from "bcryptjs"
import { DEMO_USERS } from "@/config/auth"
import * as analyticsAr from "@/data/fixtures/analytics"
import * as analyticsEn from "@/data/fixtures/locale/en/analytics"
import * as knowledgeAr from "@/data/fixtures/knowledge"
import * as knowledgeEn from "@/data/fixtures/locale/en/knowledge"
import { broadcastMessages } from "@/data/fixtures/broadcasts"
import { platformUsers } from "@/data/fixtures/users"
import {
  workflowDefinitions,
  workflowRoutingRules,
  workflowStages,
} from "@/data/fixtures/workflow"
import { getDb } from "@/lib/db"
import {
  assetKeywords,
  assetVersions,
  broadcastMessages as broadcastTable,
  categoryTopics,
  knowledgeAssets,
  lookupTranslations,
  lookups,
  searchLog,
  users,
  workflowDefinitions as workflowDefinitionsTable,
  workflowRoutingRules as workflowRoutingRulesTable,
  workflowStages as workflowStagesTable,
} from "@/lib/db/schema"
import { getDictionary } from "@/i18n"
import {
  clearCollaborationTables,
  seedCollaborationData,
  seedCollaborationLookups,
} from "@/scripts/seed-collaboration"
import {
  clearPlatformTables,
  seedPlatformData,
  seedPlatformLookups,
} from "@/scripts/seed-platform"

const KNOWLEDGE_TYPE_IDS = [
  "procedure-guide",
  "lesson-learned",
  "template-form",
  "policy",
  "expertise-report",
  "meeting-minutes",
  "study-research",
] as const

const DEPARTMENT_MAP: Record<string, string> = {
  "إدارة المشتريات": "dept-procurement",
  "إدارة التحول الرقمي": "dept-digital",
  "مكتب إدارة المشاريع": "dept-pmo",
  "إدارة حوكمة البيانات": "dept-data-gov",
  "إدارة الاتصال المؤسسي": "dept-communications",
  "إدارة التخطيط الاستراتيجي": "dept-strategy",
  "إدارة المعرفة": "dept-km",
  "إدارة الموارد البشرية": "dept-hr",
  "إدارة المشاريع": "dept-pmo",
  "حوكمة البيانات": "dept-data-gov",
  "المشتريات": "dept-procurement",
  "التحول الرقمي": "dept-digital",
  "إدارة المنصة": "dept-km",
  "الموارد البشرية": "dept-hr",
  "الاتصال المؤسسي": "dept-communications",
  "Procurement Department": "dept-procurement",
  "Digital Transformation Department": "dept-digital",
  "Project Management Office": "dept-pmo",
  "Data Governance Department": "dept-data-gov",
  "Corporate Communications Department": "dept-communications",
  "Strategic Planning Department": "dept-strategy",
  "Knowledge Management": "dept-km",
  "Human Resources Department": "dept-hr",
}

async function clearTables() {
  await clearCollaborationTables()
  await clearPlatformTables()
  const db = getDb()
  await db.delete(searchLog)
  await db.delete(assetVersions)
  await db.delete(assetKeywords)
  await db.delete(knowledgeAssets)
  await db.delete(categoryTopics)
  await db.delete(lookupTranslations)
  await db.delete(lookups)
  await db.delete(workflowRoutingRulesTable)
  await db.delete(workflowDefinitionsTable)
  await db.delete(workflowStagesTable)
  await db.delete(broadcastTable)
  await db.delete(users)
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

async function seedLookups() {
  for (const [index, category] of knowledgeAr.categories.entries()) {
    const enCategory = knowledgeEn.categories[index]
    await insertLookup(
      "category",
      category.id,
      index,
      { ar: category.name, en: enCategory.name },
      { icon: category.icon, count: category.count },
    )

    for (const [topicIndex, topic] of category.topics.entries()) {
      await getDb().insert(categoryTopics).values({
        categoryId: category.id,
        locale: "ar",
        topic,
        sortOrder: topicIndex,
      })
      await getDb().insert(categoryTopics).values({
        categoryId: category.id,
        locale: "en",
        topic: enCategory.topics[topicIndex],
        sortOrder: topicIndex,
      })
    }
  }

  for (const [index, level] of knowledgeAr.confidentialityLevels.entries()) {
    const enLevel = knowledgeEn.confidentialityLevels[index]
    await insertLookup("confidentiality", level.id, index, { ar: level.name, en: enLevel.name }, { color: level.color })
  }

  for (const [index, type] of knowledgeAr.knowledgeTypes.entries()) {
    await insertLookup(
      "knowledge_type",
      KNOWLEDGE_TYPE_IDS[index],
      index,
      { ar: type, en: knowledgeEn.knowledgeTypes[index] },
    )
  }

  const departments = [
    { id: "dept-procurement", ar: "إدارة المشتريات", en: "Procurement Department" },
    { id: "dept-digital", ar: "إدارة التحول الرقمي", en: "Digital Transformation Department" },
    { id: "dept-pmo", ar: "مكتب إدارة المشاريع", en: "Project Management Office" },
    { id: "dept-data-gov", ar: "إدارة حوكمة البيانات", en: "Data Governance Department" },
    { id: "dept-communications", ar: "إدارة الاتصال المؤسسي", en: "Corporate Communications Department" },
    { id: "dept-strategy", ar: "إدارة التخطيط الاستراتيجي", en: "Strategic Planning Department" },
    { id: "dept-km", ar: "إدارة المعرفة", en: "Knowledge Management" },
    { id: "dept-hr", ar: "إدارة الموارد البشرية", en: "Human Resources Department" },
  ]
  for (const [index, department] of departments.entries()) {
    await insertLookup("department", department.id, index, { ar: department.ar, en: department.en })
  }

  const fileTypes = [
    { id: "pdf", ar: "PDF", en: "PDF" },
    { id: "docx", ar: "DOCX", en: "DOCX" },
    { id: "doc", ar: "DOC", en: "DOC" },
    { id: "xlsx", ar: "XLSX", en: "XLSX" },
    { id: "xls", ar: "XLS", en: "XLS" },
    { id: "pptx", ar: "PPTX", en: "PPTX" },
    { id: "ppt", ar: "PPT", en: "PPT" },
  ]
  for (const [index, fileType] of fileTypes.entries()) {
    await insertLookup("file_type", fileType.id, index, { ar: fileType.ar, en: fileType.en })
  }

  const assetStatuses = [
    { id: "published", ar: "منشور", en: "Published" },
    { id: "review", ar: "قيد المراجعة", en: "In review" },
    { id: "draft", ar: "مسودة", en: "Draft" },
  ]
  for (const [index, status] of assetStatuses.entries()) {
    await insertLookup("asset_status", status.id, index, { ar: status.ar, en: status.en })
  }

  const arEnums = getDictionary("ar").enums
  const enEnums = getDictionary("en").enums
  const sessionTypeIds = ["project-close", "expert", "handover", "best-practice", "lessons-learned"] as const
  const sessionTypeKeys = ["projectClose", "expert", "handover", "bestPractice", "lessonsLearned"] as const
  for (const [index, id] of sessionTypeIds.entries()) {
    const key = sessionTypeKeys[index]
    await insertLookup(
      "transfer_session_type",
      id,
      index,
      { ar: arEnums.transferSessionTypes[key].label, en: enEnums.transferSessionTypes[key].label },
      { descAr: arEnums.transferSessionTypes[key].desc, descEn: enEnums.transferSessionTypes[key].desc },
    )
  }

  const domains = [
    { id: "domain-projects", ar: "إدارة المشاريع", en: "Project Management" },
    { id: "domain-procurement", ar: "المشتريات", en: "Procurement" },
    { id: "domain-digital", ar: "التقنية", en: "Technology" },
    { id: "domain-governance", ar: "الحوكمة", en: "Governance" },
    { id: "domain-strategy", ar: "الاستراتيجية", en: "Strategy" },
    { id: "domain-hr", ar: "الموارد البشرية", en: "Human Resources" },
    { id: "domain-communications", ar: "الاتصال المؤسسي", en: "Corporate Communications" },
  ]
  for (const [index, domain] of domains.entries()) {
    await insertLookup("domain", domain.id, index, { ar: domain.ar, en: domain.en })
  }

  for (const [index, term] of analyticsAr.topSearches.entries()) {
    await insertLookup(
      "popular_search",
      `search-${index + 1}`,
      index,
      { ar: term.term, en: analyticsEn.topSearches[index]?.term ?? term.term },
      { count: term.count, success: term.success },
    )
  }

  for (const [index, suggestion] of analyticsAr.searchSuggestions.entries()) {
    await insertLookup(
      "search_suggestion",
      `suggestion-${index + 1}`,
      index,
      { ar: suggestion, en: analyticsEn.searchSuggestions[index] ?? suggestion },
    )
  }
}

function resolveKnowledgeTypeId(typeLabel: string) {
  const index = knowledgeAr.knowledgeTypes.indexOf(typeLabel)
  return KNOWLEDGE_TYPE_IDS[index >= 0 ? index : 0]
}

function resolveFileTypeId(fileType: string) {
  return fileType.toLowerCase()
}

async function seedAssets() {
  const db = getDb()
  for (const [index, asset] of knowledgeAr.assets.entries()) {
    const enAsset = knowledgeEn.assets[index]
    await db.insert(knowledgeAssets).values({
      id: asset.id,
      titleAr: asset.title,
      titleEn: enAsset.title,
      knowledgeTypeId: resolveKnowledgeTypeId(asset.type),
      categoryId: asset.category,
      departmentId: DEPARTMENT_MAP[asset.department] ?? "dept-km",
      author: asset.author,
      confidentialityId: asset.confidentiality,
      version: asset.version,
      updated: asset.updated,
      nextReview: asset.nextReview,
      views: asset.views,
      rating: asset.rating,
      status: asset.status,
      summaryAr: asset.summary,
      summaryEn: enAsset.summary,
      fileTypeId: resolveFileTypeId(asset.fileType),
      createdAt: asset.updated,
    })

    for (const keyword of asset.keywords) {
      await db.insert(assetKeywords).values({ assetId: asset.id, locale: "ar", keyword })
    }
    for (const keyword of enAsset.keywords) {
      await db.insert(assetKeywords).values({ assetId: asset.id, locale: "en", keyword })
    }
  }

  for (const version of knowledgeAr.versionHistory) {
    await db.insert(assetVersions).values({
      assetId: "KA-1042",
      version: version.v,
      date: version.date,
      author: version.by,
      note: version.note,
    })
  }
}

async function seedUsers() {
  const db = getDb()
  const passwordMap = new Map(DEMO_USERS.map((user) => [user.username, user.password]))

  for (const user of platformUsers) {
    const password = passwordMap.get(user.username) ?? "demo123"
    const passwordHash = await bcrypt.hash(password, 10)

    await db.insert(users).values({
      id: user.id,
      username: user.username.toLowerCase(),
      passwordHash,
      displayName: user.displayName,
      role: user.role,
      departmentId: DEPARTMENT_MAP[user.department],
      email: user.email,
      status: user.status,
      lastLoginAt: user.lastLogin.replace(" ", "T") + ":00.000Z",
      createdAt: new Date().toISOString(),
    })
  }
}

async function seedWorkflows() {
  const db = getDb()
  for (const stage of workflowStages) {
    await db.insert(workflowStagesTable).values({
      id: stage.id,
      label: stage.label,
      sortOrder: stage.order,
      role: stage.role,
      slaHours: stage.slaHours,
      notifyOnEnter: stage.notifyOnEnter,
      autoEscalate: stage.autoEscalate,
      actions: stage.actions,
      isSystem: stage.system ?? false,
    })
  }

  for (const workflow of workflowDefinitions) {
    await db.insert(workflowDefinitionsTable).values({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      stages: workflow.stages,
      isDefault: workflow.default,
      isActive: workflow.active,
      createdAt: workflow.createdAt,
    })
  }

  for (const rule of workflowRoutingRules) {
    await db.insert(workflowRoutingRulesTable).values(rule)
  }
}

async function seedBroadcasts() {
  const db = getDb()
  for (const message of broadcastMessages) {
    await db.insert(broadcastTable).values({
      id: message.id,
      kind: message.kind,
      title: message.title,
      body: message.body,
      audience: message.audience,
      priority: message.priority,
      status: message.status,
      notificationType: message.notificationType,
      createdBy: message.createdBy,
      createdAt: message.createdAt,
      scheduledAt: message.scheduledAt,
      publishedAt: message.publishedAt,
    })
  }
}

async function seedSearchLog() {
  const db = getDb()
  for (const term of analyticsAr.topSearches) {
    await db.insert(searchLog).values({
      term: term.term,
      locale: "ar",
      resultCount: Math.round((term.count * term.success) / 100),
      searchedAt: new Date().toISOString(),
    })
  }
}

async function main() {
  console.log("Seeding database...")
  await clearTables()
  await seedLookups()
  await seedCollaborationLookups()
  await seedPlatformLookups()
  await seedUsers()
  await seedAssets()
  await seedWorkflows()
  await seedBroadcasts()
  await seedSearchLog()
  await seedCollaborationData()
  await seedPlatformData()
  console.log("Seed complete.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
