import { workflowRepository } from "@/repositories/workflow.repository"
import type { WorkflowDefinition } from "@/types/workflow"

export function listWorkflowDefinitions(): WorkflowDefinition[] {
  return workflowRepository.listWorkflows()
}

export function getWorkflowStages() {
  return workflowRepository.getStages()
}

export function getWorkflowRoutingRules() {
  return workflowRepository.getRoutingRules()
}

export function getWorkflowMetrics() {
  return workflowRepository.getMetrics()
}

export function summarizeWorkflows(workflows: WorkflowDefinition[]) {
  return {
    total: workflows.length,
    active: workflows.filter((w) => w.active).length,
    defaultWorkflow: workflows.find((w) => w.default)?.name ?? "—",
  }
}

export function countRoutingRulesForWorkflow(workflowId: string) {
  return workflowRepository.getRoutingRules().filter((rule) => rule.workflowId === workflowId).length
}

export function countWorkflowsUsingStage(workflows: WorkflowDefinition[], stageId: string) {
  return workflows.filter((workflow) => workflow.stages.includes(stageId)).length
}

export function summarizeStages(stages: import("@/types/workflow").WorkflowStage[]) {
  return {
    total: stages.length,
    system: stages.filter((stage) => stage.system).length,
    custom: stages.filter((stage) => !stage.system).length,
    withEscalation: stages.filter((stage) => stage.autoEscalate).length,
  }
}

/** @deprecated Use granular getters — kept for any legacy imports */
export function getWorkflowConfig() {
  return {
    workflows: workflowRepository.listWorkflows(),
    stages: workflowRepository.getStages(),
    routingRules: workflowRepository.getRoutingRules(),
    metrics: workflowRepository.getMetrics(),
  }
}
