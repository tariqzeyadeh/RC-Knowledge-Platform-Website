import { jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  deleteWorkflowDefinition,
  updateWorkflowDefinition,
} from "@/lib/db/repositories/admin.repository"
import type { WorkflowDefinition } from "@/types/workflow"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  const body = (await request.json()) as Partial<WorkflowDefinition>
  const workflow = await updateWorkflowDefinition(id, body)
  if (!workflow) return errorResponse("not_found", 404)
  return jsonResponse({ workflow })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const { id } = await params
  await deleteWorkflowDefinition(id)
  return jsonResponse({ ok: true })
}
