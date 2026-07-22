import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(),
  departmentId: text("department_id"),
  email: text("email").notNull(),
  status: text("status").notNull().default("active"),
  lastLoginAt: text("last_login_at"),
  createdAt: text("created_at").notNull(),
})

export const lookups = sqliteTable(
  "lookups",
  {
    id: text("id").primaryKey(),
    group: text("group").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  },
  (table) => [uniqueIndex("lookups_group_id_idx").on(table.group, table.id)],
)

export const lookupTranslations = sqliteTable(
  "lookup_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    lookupId: text("lookup_id")
      .notNull()
      .references(() => lookups.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    label: text("label").notNull(),
    description: text("description"),
  },
  (table) => [uniqueIndex("lookup_translations_unique").on(table.lookupId, table.locale)],
)

export const categoryTopics = sqliteTable("category_topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: text("category_id")
    .notNull()
    .references(() => lookups.id, { onDelete: "cascade" }),
  locale: text("locale").notNull(),
  topic: text("topic").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const knowledgeAssets = sqliteTable("knowledge_assets", {
  id: text("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  knowledgeTypeId: text("knowledge_type_id").notNull(),
  categoryId: text("category_id").notNull(),
  departmentId: text("department_id").notNull(),
  author: text("author").notNull(),
  confidentialityId: text("confidentiality_id").notNull(),
  version: text("version").notNull(),
  updated: text("updated").notNull(),
  nextReview: text("next_review").notNull(),
  views: integer("views").notNull().default(0),
  rating: real("rating").notNull().default(0),
  status: text("status").notNull(),
  summaryAr: text("summary_ar").notNull(),
  summaryEn: text("summary_en"),
  fileTypeId: text("file_type_id").notNull(),
  createdAt: text("created_at").notNull(),
})

export const assetKeywords = sqliteTable("asset_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetId: text("asset_id")
    .notNull()
    .references(() => knowledgeAssets.id, { onDelete: "cascade" }),
  locale: text("locale").notNull(),
  keyword: text("keyword").notNull(),
})

export const assetVersions = sqliteTable("asset_versions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetId: text("asset_id")
    .notNull()
    .references(() => knowledgeAssets.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  date: text("date").notNull(),
  author: text("author").notNull(),
  note: text("note").notNull(),
})

export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileTypeId: text("file_type_id"),
  sizeBytes: integer("size_bytes").notNull(),
  contentBase64: text("content_base64").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: text("created_at").notNull(),
})

export const workflowStages = sqliteTable("workflow_stages", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull(),
  role: text("role").notNull(),
  slaHours: integer("sla_hours").notNull().default(0),
  notifyOnEnter: integer("notify_on_enter", { mode: "boolean" }).notNull().default(false),
  autoEscalate: integer("auto_escalate", { mode: "boolean" }).notNull().default(false),
  actions: text("actions", { mode: "json" }).$type<string[]>().notNull(),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
})

export const workflowDefinitions = sqliteTable("workflow_definitions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stages: text("stages", { mode: "json" }).$type<string[]>().notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
})

export const workflowRoutingRules = sqliteTable("workflow_routing_rules", {
  id: text("id").primaryKey(),
  conditionKey: text("condition_key").notNull(),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflowDefinitions.id, { onDelete: "cascade" }),
})

export const broadcastMessages = sqliteTable("broadcast_messages", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  audience: text("audience").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  notificationType: text("notification_type"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  scheduledAt: text("scheduled_at"),
  publishedAt: text("published_at"),
})

export const searchLog = sqliteTable("search_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  term: text("term").notNull(),
  locale: text("locale").notNull(),
  resultCount: integer("result_count").notNull().default(0),
  searchedAt: text("searched_at").notNull(),
})

export const communities = sqliteTable("communities", {
  id: text("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  domainId: text("domain_id").notNull(),
  owner: text("owner").notNull(),
  descAr: text("desc_ar").notNull(),
  descEn: text("desc_en"),
  charterAr: text("charter_ar").notNull(),
  charterEn: text("charter_en"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  members: integer("members").notNull().default(0),
  posts: integer("posts").notNull().default(0),
  createdAt: text("created_at").notNull(),
})

export const communityItems = sqliteTable("community_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  locale: text("locale").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const communityLinkedAssets = sqliteTable("community_linked_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  assetId: text("asset_id").notNull(),
})

export const communityPosts = sqliteTable("community_posts", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  replies: integer("replies").notNull().default(0),
  convertedToAssetId: text("converted_to_asset_id"),
})

export const transferSessions = sqliteTable("transfer_sessions", {
  id: text("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  expert: text("expert").notNull(),
  date: text("date").notNull(),
  statusId: text("status_id").notNull(),
  domainId: text("domain_id").notNull(),
  departmentId: text("department_id").notNull(),
  durationId: text("duration_id").notNull(),
  facilitator: text("facilitator").notNull(),
  sessionTypeId: text("session_type_id").notNull(),
  attendees: integer("attendees").notNull().default(0),
  agenda: text("agenda", { mode: "json" }).$type<string[]>().notNull().default([]),
  keyQuestions: text("key_questions", { mode: "json" }).$type<string[]>().notNull().default([]),
  summaryAr: text("summary_ar").notNull(),
  summaryEn: text("summary_en"),
  nextStepsAr: text("next_steps_ar"),
  nextStepsEn: text("next_steps_en"),
  outputsCount: integer("outputs_count").notNull().default(0),
  createdAt: text("created_at").notNull(),
})

export const transferOutputs = sqliteTable("transfer_outputs", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => transferSessions.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  statusId: text("status_id").notNull(),
  assetId: text("asset_id"),
})

export const reviewItems = sqliteTable("review_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  knowledgeTypeId: text("knowledge_type_id"),
  submittedBy: text("submitted_by").notNull(),
  departmentId: text("department_id").notNull(),
  submittedAt: text("submitted_at").notNull(),
  stageId: text("stage_id").notNull(),
  sla: text("sla").notNull(),
  priorityId: text("priority_id").notNull(),
  assetId: text("asset_id"),
})

export const knowledgeNeeds = sqliteTable("knowledge_needs", {
  id: text("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  unitId: text("unit_id").notNull(),
  priorityId: text("priority_id").notNull(),
  statusId: text("status_id").notNull(),
  votes: integer("votes").notNull().default(0),
  assignedTo: text("assigned_to").notNull(),
  requestedBy: text("requested_by").notNull(),
  requestedAt: text("requested_at").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en"),
  justificationAr: text("justification_ar").notNull(),
  justificationEn: text("justification_en"),
  expectedOutcomeAr: text("expected_outcome_ar").notNull(),
  expectedOutcomeEn: text("expected_outcome_en"),
  timeline: text("timeline"),
  linkedAssetId: text("linked_asset_id"),
})

export const userNotifications = sqliteTable("user_notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  timeLabel: text("time_label").notNull(),
  unread: integer("unread", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
})

export const governanceRoles = sqliteTable("governance_roles", {
  id: text("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  users: integer("users").notNull().default(0),
  descAr: text("desc_ar").notNull(),
  descEn: text("desc_en"),
  permissions: text("permissions", { mode: "json" })
    .$type<{ create: boolean; review: boolean; approve: boolean; publish: boolean; admin: boolean }>()
    .notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const auditLogEntries = sqliteTable("audit_log_entries", {
  id: text("id").primaryKey(),
  user: text("user").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  time: text("time").notNull(),
  ip: text("ip").notNull(),
  resultId: text("result_id").notNull(),
})

export const seciLayers = sqliteTable("seci_layers", {
  id: text("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  seciAr: text("seci_ar").notNull(),
  seciEn: text("seci_en"),
  knowledgeTypeAr: text("knowledge_type_ar").notNull(),
  knowledgeTypeEn: text("knowledge_type_en"),
  color: text("color").notNull(),
  descAr: text("desc_ar").notNull(),
  descEn: text("desc_en"),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const platformFeatures = sqliteTable("platform_features", {
  code: text("code").primaryKey(),
  layer: text("layer").notNull(),
  seciStage: text("seci_stage").notNull(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  descAr: text("desc_ar").notNull(),
  descEn: text("desc_en"),
  impactAr: text("impact_ar").notNull(),
  impactEn: text("impact_en"),
  exampleAr: text("example_ar").notNull(),
  exampleEn: text("example_en"),
  roles: text("roles", { mode: "json" }).$type<string[]>().notNull(),
  iso: text("iso").notNull(),
  efqm: text("efqm").notNull(),
  national: text("national").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const trainingPrograms = sqliteTable("training_programs", {
  id: text("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  audienceAr: text("audience_ar").notNull(),
  audienceEn: text("audience_en"),
  durationAr: text("duration_ar").notNull(),
  durationEn: text("duration_en"),
  formatAr: text("format_ar").notNull(),
  formatEn: text("format_en"),
  lessons: integer("lessons").notNull(),
  levelAr: text("level_ar").notNull(),
  levelEn: text("level_en"),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const complianceMatrix = sqliteTable("compliance_matrix", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  standard: text("standard").notNull(),
  scopeAr: text("scope_ar").notNull(),
  scopeEn: text("scope_en"),
  coverage: integer("coverage").notNull(),
  statusId: text("status_id").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const securityControls = sqliteTable("security_controls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  valueAr: text("value_ar").notNull(),
  valueEn: text("value_en"),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const monthlyActivity = sqliteTable("monthly_activity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  monthAr: text("month_ar").notNull(),
  monthEn: text("month_en"),
  published: integer("published").notNull(),
  searches: integer("searches").notNull(),
  contributions: integer("contributions").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const topContributors = sqliteTable("top_contributors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contributions: integer("contributions").notNull(),
  assets: integer("assets").notNull(),
  departmentAr: text("department_ar").notNull(),
  departmentEn: text("department_en"),
  sortOrder: integer("sort_order").notNull().default(0),
})
