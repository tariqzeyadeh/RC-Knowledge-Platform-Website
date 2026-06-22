import {
  workflowDefinitions,
  workflowMetrics,
  workflowRoutingRules,
  workflowStages,
} from "@/data/fixtures/workflow"

export const workflowRepository = {
  listWorkflows: () => workflowDefinitions,
  getStages: () => workflowStages,
  getRoutingRules: () => workflowRoutingRules,
  getMetrics: () => workflowMetrics,
}
