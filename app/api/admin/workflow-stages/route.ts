import { jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import {
  createWorkflowStage,
  listWorkflowStages,
} from "@/lib/db/repositories/admin.repository"
import type { WorkflowStage } from "@/types/workflow"

export async function GET() {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const stages = await listWorkflowStages()
  return jsonResponse({ stages })
}

export async function POST(request: Request) {
  const user = await requireSession(["superAdmin"])
  if (!user) return errorResponse("unauthorized", 401)

  const body = (await request.json()) as WorkflowStage
  const stage = await createWorkflowStage(body)
  return jsonResponse({ stage }, { status: 201 })
}
