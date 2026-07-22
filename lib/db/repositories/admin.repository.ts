import { eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import {
  broadcastMessages,
  workflowDefinitions,
  workflowRoutingRules,
  workflowStages,
} from "@/lib/db/schema"
import type { BroadcastMessage } from "@/types/broadcast"
import type {
  WorkflowDefinition,
  WorkflowRoutingRule,
  WorkflowStage,
} from "@/types/workflow"

export async function listWorkflowStages(): Promise<WorkflowStage[]> {
  const db = getDb()
  const rows = await db.select().from(workflowStages).orderBy(workflowStages.sortOrder)

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    order: row.sortOrder,
    role: row.role as WorkflowStage["role"],
    slaHours: row.slaHours,
    notifyOnEnter: row.notifyOnEnter,
    autoEscalate: row.autoEscalate,
    actions: row.actions,
    system: row.isSystem,
  }))
}

export async function listWorkflowDefinitions(): Promise<WorkflowDefinition[]> {
  const db = getDb()
  const rows = await db.select().from(workflowDefinitions)

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    stages: row.stages,
    default: row.isDefault,
    active: row.isActive,
    createdAt: row.createdAt,
  }))
}

export async function getWorkflowRoutingRules(): Promise<WorkflowRoutingRule[]> {
  const db = getDb()
  const rows = await db.select().from(workflowRoutingRules)
  return rows.map((row) => ({
    id: row.id,
    conditionKey: row.conditionKey,
    workflowId: row.workflowId,
  }))
}

export async function createWorkflowDefinition(data: WorkflowDefinition) {
  const db = getDb()
  await db.insert(workflowDefinitions).values({
    id: data.id,
    name: data.name,
    description: data.description,
    stages: data.stages,
    isDefault: data.default,
    isActive: data.active,
    createdAt: data.createdAt,
  })
  return data
}

export async function updateWorkflowDefinition(id: string, data: Partial<WorkflowDefinition>) {
  const db = getDb()
  await db
    .update(workflowDefinitions)
    .set({
      name: data.name,
      description: data.description,
      stages: data.stages,
      isDefault: data.default,
      isActive: data.active,
    })
    .where(eq(workflowDefinitions.id, id))

  const row = await db.select().from(workflowDefinitions).where(eq(workflowDefinitions.id, id)).get()
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    stages: row.stages,
    default: row.isDefault,
    active: row.isActive,
    createdAt: row.createdAt,
  } satisfies WorkflowDefinition
}

export async function deleteWorkflowDefinition(id: string) {
  const db = getDb()
  await db.delete(workflowDefinitions).where(eq(workflowDefinitions.id, id))
}

export async function createWorkflowStage(data: WorkflowStage) {
  const db = getDb()
  await db.insert(workflowStages).values({
    id: data.id,
    label: data.label,
    sortOrder: data.order,
    role: data.role,
    slaHours: data.slaHours,
    notifyOnEnter: data.notifyOnEnter,
    autoEscalate: data.autoEscalate,
    actions: data.actions,
    isSystem: data.system ?? false,
  })
  return data
}

export async function updateWorkflowStage(id: string, data: Partial<WorkflowStage>) {
  const db = getDb()
  await db
    .update(workflowStages)
    .set({
      label: data.label,
      sortOrder: data.order,
      role: data.role,
      slaHours: data.slaHours,
      notifyOnEnter: data.notifyOnEnter,
      autoEscalate: data.autoEscalate,
      actions: data.actions,
      isSystem: data.system,
    })
    .where(eq(workflowStages.id, id))
}

export async function deleteWorkflowStage(id: string) {
  const db = getDb()
  await db.delete(workflowStages).where(eq(workflowStages.id, id))
}

export async function listBroadcastMessages(): Promise<BroadcastMessage[]> {
  const db = getDb()
  const rows = await db.select().from(broadcastMessages).orderBy(broadcastMessages.createdAt)

  return rows.map((row) => ({
    id: row.id,
    kind: row.kind as BroadcastMessage["kind"],
    title: row.title,
    body: row.body,
    audience: row.audience as BroadcastMessage["audience"],
    priority: row.priority as BroadcastMessage["priority"],
    status: row.status as BroadcastMessage["status"],
    notificationType: row.notificationType as BroadcastMessage["notificationType"],
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    scheduledAt: row.scheduledAt ?? undefined,
    publishedAt: row.publishedAt ?? undefined,
  }))
}

export async function createBroadcastMessage(data: BroadcastMessage) {
  const db = getDb()
  await db.insert(broadcastMessages).values({
    id: data.id,
    kind: data.kind,
    title: data.title,
    body: data.body,
    audience: data.audience,
    priority: data.priority,
    status: data.status,
    notificationType: data.notificationType,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    scheduledAt: data.scheduledAt,
    publishedAt: data.publishedAt,
  })
  return data
}

export async function updateBroadcastMessage(id: string, data: Partial<BroadcastMessage>) {
  const db = getDb()
  await db
    .update(broadcastMessages)
    .set({
      kind: data.kind,
      title: data.title,
      body: data.body,
      audience: data.audience,
      priority: data.priority,
      status: data.status,
      notificationType: data.notificationType,
      createdBy: data.createdBy,
      scheduledAt: data.scheduledAt,
      publishedAt: data.publishedAt,
    })
    .where(eq(broadcastMessages.id, id))
}

export async function deleteBroadcastMessage(id: string) {
  const db = getDb()
  await db.delete(broadcastMessages).where(eq(broadcastMessages.id, id))
}
