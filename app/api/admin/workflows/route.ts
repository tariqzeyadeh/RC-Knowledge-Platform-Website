import { jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  createWorkflowDefinition,
  listWorkflowDefinitions,
} from "@/lib/db/repositories/admin.repository"
import type { WorkflowDefinition } from "@/types/workflow"

export async function GET() {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const workflows = await listWorkflowDefinitions()
  return jsonResponse({ workflows })
}

export async function POST(request: Request) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const body = (await request.json()) as WorkflowDefinition
  const workflow = await createWorkflowDefinition(body)
  return jsonResponse({ workflow }, { status: 201 })
}
