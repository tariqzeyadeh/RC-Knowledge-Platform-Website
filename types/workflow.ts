import type { UserRole } from "@/types/auth"

/** Built-in stage identifiers — draft and publish are required in every workflow */
export type BuiltinWorkflowStageId = "draft" | "review" | "approval" | "publish"

export type WorkflowStageId = BuiltinWorkflowStageId | (string & {})

export const REQUIRED_STAGE_IDS: BuiltinWorkflowStageId[] = ["draft", "publish"]

export const WORKFLOW_ACTION_OPTIONS = [
  "save",
  "submit",
  "comment",
  "return",
  "forward",
  "approve",
  "reject",
  "publish",
  "schedule",
] as const

export type WorkflowActionId = (typeof WORKFLOW_ACTION_OPTIONS)[number]

export type WorkflowStage = {
  id: string
  label: string
  order: number
  role: UserRole
  slaHours: number
  notifyOnEnter: boolean
  autoEscalate: boolean
  actions: string[]
  system?: boolean
}

export type WorkflowDefinition = {
  id: string
  name: string
  description: string
  stages: string[]
  default: boolean
  active: boolean
  createdAt: string
}

export type WorkflowRoutingRule = {
  id: string
  conditionKey: string
  workflowId: string
}

export type WorkflowMetrics = {
  draft: number
  review: number
  approval: number
  publish: number
  rejected: number
  avgCycleDays: number
}

export function getOrderedStageIds(stages: WorkflowStage[]): string[] {
  return [...stages].sort((a, b) => a.order - b.order).map((stage) => stage.id)
}

export function normalizeWorkflowStages(stages: string[], allStages: WorkflowStage[]): string[] {
  const order = getOrderedStageIds(allStages)
  const selected = new Set(stages)
  return order.filter((id) => selected.has(id))
}

export function isValidWorkflowStages(stages: string[], allStages: WorkflowStage[]): boolean {
  const normalized = normalizeWorkflowStages(stages, allStages)
  if (normalized.length < 2) return false
  return (
    normalized[0] === "draft" &&
    normalized[normalized.length - 1] === "publish" &&
    normalized.every((id) => allStages.some((stage) => stage.id === id))
  )
}

export function isBuiltinStageId(id: string): id is BuiltinWorkflowStageId {
  return id === "draft" || id === "review" || id === "approval" || id === "publish"
}

/** @deprecated Use getOrderedStageIds(stageConfig) */
export const WORKFLOW_STAGE_ORDER: BuiltinWorkflowStageId[] = ["draft", "review", "approval", "publish"]
