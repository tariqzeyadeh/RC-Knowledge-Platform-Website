// Domain types — SECI lifecycle and platform modules (ISO 30401 / F-01–F-30)

export type SeciLayer = {
  id: string
  title: string
  seci: string
  knowledgeType: string
  color: string
  desc: string
}

export type Feature = {
  code: string
  layer: string
  seciStage: string
  name: string
  nameEn: string
  desc: string
  impact: string
  example: string
  roles: string[]
  iso: string
  efqm: string
  national: string
}

export type Category = {
  id: string
  name: string
  count: number
  icon: string
  topics: string[]
}

export type KnowledgeAsset = {
  id: string
  title: string
  type: string
  category: string
  department: string
  author: string
  confidentiality: "public" | "internal" | "confidential" | "strict"
  version: string
  updated: string
  nextReview: string
  views: number
  rating: number
  status: "published" | "review" | "draft"
  keywords: string[]
  summary: string
  fileType: string
}

export type CommunityPost = {
  id: string
  title: string
  author: string
  date: string
  replies: number
  convertedToAsset?: string
}

export type Community = {
  id: string
  name: string
  members: number
  posts: number
  domain: string
  owner: string
  desc: string
  active: boolean
  createdAt: string
  objectives: string[]
  topics: string[]
  moderators: string[]
  recentPosts: CommunityPost[]
  linkedAssetIds: string[]
  charter: string
}

export type TransferOutputStatus =
  | "معتمد" | "قيد المراجعة" | "مسودة"
  | "Approved" | "Under review" | "Draft"

export type TransferSessionStatus =
  | "مكتملة" | "مجدولة" | "قيد التوثيق"
  | "Completed" | "Scheduled" | "Documenting"

export type ReviewStage =
  | "مراجعة" | "اعتماد" | "مسودة"
  | "Review" | "Approval" | "Draft"

export type ReviewPriority =
  | "عالية" | "متوسطة" | "عادية"
  | "High" | "Medium" | "Normal"

export type NeedPriority =
  | "عالية" | "متوسطة" | "منخفضة"
  | "High" | "Medium" | "Low"

export type NeedStatus =
  | "جديد" | "قيد الإنتاج" | "منشور"
  | "New" | "In production" | "Published"

export type AuditResult =
  | "نجاح" | "رفض"
  | "Success" | "Denied"

export type TransferOutput = {
  id: string
  title: string
  type: string
  status: TransferOutputStatus
  assetId?: string
}

export type TransferSession = {
  id: string
  title: string
  expert: string
  date: string
  status: TransferSessionStatus
  outputs: number
  domain: string
  department: string
  duration: string
  facilitator: string
  sessionType: string
  attendees: number
  agenda: string[]
  keyQuestions: string[]
  documentedOutputs: TransferOutput[]
  summary: string
  nextSteps?: string
}

export type ReviewItem = {
  id: string
  title: string
  type: string
  submittedBy: string
  department: string
  submittedAt: string
  stage: ReviewStage
  sla: string
  priority: ReviewPriority
}

export type KnowledgeNeed = {
  id: string
  title: string
  unit: string
  priority: NeedPriority
  status: NeedStatus
  votes: number
  assignedTo: string
  requestedBy: string
  requestedAt: string
  description: string
  justification: string
  expectedOutcome: string
  timeline?: string
  linkedAssetId?: string
}

export type Notification = {
  id: string
  type: "review" | "approved" | "rejected" | "new" | "expiry" | "access"
  title: string
  desc: string
  time: string
  unread: boolean
}

export type AuditEntry = {
  id: string
  user: string
  action: string
  target: string
  time: string
  ip: string
  result: AuditResult
}

export type Role = {
  id: string
  name: string
  users: number
  desc: string
  permissions: { create: boolean; review: boolean; approve: boolean; publish: boolean; admin: boolean }
}

export type ConfidentialityLevel = KnowledgeAsset["confidentiality"]
export type AssetStatus = KnowledgeAsset["status"]
export type AssetSort = "relevance" | "recent" | "popular"

export type AssetFilters = {
  query?: string
  categoryId?: string
  type?: string
  confidentiality?: string
}

export type SearchFilters = AssetFilters & {
  department?: string
  fileType?: string
  dateFrom?: string
  dateTo?: string
}
