import { getLocaleFromRequest, jsonResponse, errorResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { createCommunity, listCommunities } from "@/lib/db/repositories/collaboration.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const communities = await listCommunities(locale)
  return jsonResponse({ communities })
}

export async function POST(request: Request) {
  const user = await requireSession()
  if (!user) return errorResponse("unauthorized", 401)

  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as {
    name: string
    domainId: string
    description: string
    owner?: string
    objectives: string[]
    topics: string[]
    charter: string
    moderators?: string
  }

  if (!body.name?.trim() || !body.domainId || !body.description?.trim()) {
    return errorResponse("invalid_request", 400)
  }

  const community = await createCommunity(
    {
      id: `C-${Date.now()}`,
      nameAr: body.name.trim(),
      domainId: body.domainId,
      owner: body.owner?.trim() || user.displayName,
      descAr: body.description.trim(),
      charterAr: body.charter?.trim() ?? "",
      objectivesAr: body.objectives.filter(Boolean),
      topicsAr: body.topics.filter(Boolean),
      moderators: body.moderators
        ? body.moderators.split(/[,،]/).map((item) => item.trim()).filter(Boolean)
        : [],
      creatorUsername: user.username,
    },
    locale,
  )

  return jsonResponse({ community }, { status: 201 })
}
