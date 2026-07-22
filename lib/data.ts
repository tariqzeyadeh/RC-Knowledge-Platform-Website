/**
 * Backward-compatible barrel — prefer direct imports from types/, config/, data/, repositories/, services/.
 * @deprecated Import from layered modules instead of this file for new code.
 *
 * STATIC_DEMO_DATA: fixture re-exports below are preserved for seeding/reference — not used by page UIs
 * when RENDER_STATIC_DEMO_DATA is false in config/demo-display.ts.
 */

export * from "@/types/domain"
export { ORG } from "@/config/org"
export { confidentialityMap } from "@/config/presentation"
export { navGroups } from "@/config/navigation"
export type { NavItem, NavGroup } from "@/config/navigation"

export { seciLayers } from "@/data/fixtures/seci"
export { features } from "@/data/fixtures/features"
export {
  categories,
  confidentialityLevels,
  knowledgeTypes,
  assets,
} from "@/data/fixtures/knowledge"
export {
  communities,
  transferSessions,
  reviewQueue,
  needs,
  notifications,
} from "@/data/fixtures/collaboration"
export { auditLog, roles } from "@/data/fixtures/governance"
export {
  kpis,
  monthlyActivity,
  departmentContribution,
  contentHealth,
  topSearches,
  topContributors,
  topCommunities,
  trainingPrograms,
  complianceMatrix,
  securityControls,
} from "@/data/fixtures/analytics"

import { collaborationRepository } from "@/repositories/collaboration.repository"
import { knowledgeRepository } from "@/repositories/knowledge.repository"
import { seciRepository } from "@/repositories/seci.repository"

export { knowledgeRepository, seciRepository, collaborationRepository }

export function getAsset(id: string) {
  return knowledgeRepository.getAsset(id)
}

export function getCategory(id: string) {
  return knowledgeRepository.getCategory(id)
}

export function getCommunity(id: string) {
  return collaborationRepository.getCommunity(id)
}

export function getTransferSession(id: string) {
  return collaborationRepository.getTransferSession(id)
}

export function getNeed(id: string) {
  return collaborationRepository.getNeed(id)
}

export function getLayer(id: string) {
  return seciRepository.getLayer(id)
}

export { searchAssets } from "@/services/knowledge/asset-search.service"
export { filterAssets, getPublishedAssets, getRelatedAssets } from "@/services/knowledge/asset-filter.service"
