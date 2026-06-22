import type {
  WorkflowDefinition,
  WorkflowMetrics,
  WorkflowRoutingRule,
  WorkflowStage,
} from "@/types/workflow"

export const workflowStages: WorkflowStage[] = [
  {
    id: "draft",
    label: "مسودة",
    order: 1,
    role: "contributor",
    slaHours: 0,
    notifyOnEnter: false,
    autoEscalate: false,
    actions: ["save", "submit"],
    system: true,
  },
  {
    id: "review",
    label: "مراجعة",
    order: 2,
    role: "reviewer",
    slaHours: 48,
    notifyOnEnter: true,
    autoEscalate: true,
    actions: ["comment", "return", "forward"],
    system: true,
  },
  {
    id: "quality-check",
    label: "فحص الجودة",
    order: 3,
    role: "reviewer",
    slaHours: 24,
    notifyOnEnter: true,
    autoEscalate: true,
    actions: ["comment", "return", "forward"],
  },
  {
    id: "approval",
    label: "اعتماد",
    order: 4,
    role: "reviewer",
    slaHours: 24,
    notifyOnEnter: true,
    autoEscalate: true,
    actions: ["approve", "reject"],
    system: true,
  },
  {
    id: "publish",
    label: "نشر",
    order: 5,
    role: "admin",
    slaHours: 0,
    notifyOnEnter: true,
    autoEscalate: false,
    actions: ["publish", "schedule"],
    system: true,
  },
]

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: "WF-simple",
    name: "مسار مبسّط",
    description: "مسودة → مراجعة → نشر — للقوالب والمحتوى العام منخفض المخاطر.",
    stages: ["draft", "review", "publish"],
    default: false,
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "WF-standard",
    name: "المسار المعياري",
    description: "مسودة → مراجعة → اعتماد → نشر — المسار الافتراضي لمعظم الأصول المعرفية.",
    stages: ["draft", "review", "approval", "publish"],
    default: true,
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "WF-compliance",
    name: "مسار الامتثال",
    description: "مراجعة موسّعة وفحص جودة واعتماد متعدد المستويات للسياسات والمحتوى السري.",
    stages: ["draft", "review", "quality-check", "approval", "publish"],
    default: false,
    active: true,
    createdAt: "2024-02-01",
  },
  {
    id: "WF-fast-track",
    name: "مسار سريع للقوالب",
    description: "مسودة → نشر مباشر للقوالب المعتمدة مسبقاً دون مراجعة إضافية.",
    stages: ["draft", "publish"],
    default: false,
    active: true,
    createdAt: "2025-11-10",
  },
]

export const workflowRoutingRules: WorkflowRoutingRule[] = [
  { id: "R-01", conditionKey: "policiesConfidential", workflowId: "WF-compliance" },
  { id: "R-02", conditionKey: "proceduresInternal", workflowId: "WF-standard" },
  { id: "R-03", conditionKey: "templatesPublic", workflowId: "WF-simple" },
  { id: "R-04", conditionKey: "lessonsInternal", workflowId: "WF-standard" },
]

export const workflowMetrics: WorkflowMetrics = {
  draft: 12,
  review: 8,
  approval: 4,
  publish: 156,
  rejected: 3,
  avgCycleDays: 2.4,
}
