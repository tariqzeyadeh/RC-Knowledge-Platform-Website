import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { createNeed, listNeeds } from "@/lib/db/repositories/collaboration.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const needs = await listNeeds(locale)
  return jsonResponse({ needs })
}

export async function POST(request: Request) {
  const user = await requireSession()
  if (!user) return errorResponse("unauthorized", 401)

  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as {
    title: string
    unitId: string
    priorityId: string
    description: string
    justification: string
    expectedOutcome: string
  }

  const need = await createNeed(
    {
      id: `N-${Date.now()}`,
      titleAr: body.title,
      unitId: body.unitId,
      priorityId: body.priorityId,
      descriptionAr: body.description,
      justificationAr: body.justification,
      expectedOutcomeAr: body.expectedOutcome,
      requestedBy: user.displayName,
    },
    locale,
  )

  return jsonResponse({ need }, { status: 201 })
}
