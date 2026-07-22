import { getLocaleFromRequest, jsonResponse } from "@/lib/api/http"
import { requireSession } from "@/lib/api/session"
import { createTransferSession, listTransferSessions } from "@/lib/db/repositories/collaboration.repository"
import { resolveLookupIdByLabel } from "@/lib/db/repositories/lookup.repository"

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request)
  const sessions = await listTransferSessions(locale)
  return jsonResponse({ sessions })
}

export async function POST(request: Request) {
  const user = await requireSession(["contributor", "reviewer", "admin"])
  if (!user) return jsonResponse({ error: "unauthorized" }, { status: 401 })

  const locale = getLocaleFromRequest(request)
  const body = (await request.json()) as {
    title: string
    expert: string
    date: string
    domainId: string
    departmentId?: string
    departmentLabel?: string
    durationId: string
    facilitator: string
    sessionTypeId: string
    attendees: number
    agenda: string[]
    summary: string
  }

  const departmentId =
    body.departmentId ??
    (body.departmentLabel
      ? await resolveLookupIdByLabel("department", body.departmentLabel, locale)
      : undefined) ??
    "dept-km"

  const session = await createTransferSession(
    {
      id: `TS-${Date.now()}`,
      titleAr: body.title,
      expert: body.expert,
      date: body.date,
      statusId: "tss-scheduled",
      domainId: body.domainId,
      departmentId,
      durationId: body.durationId,
      facilitator: body.facilitator,
      sessionTypeId: body.sessionTypeId,
      attendees: body.attendees,
      agenda: body.agenda.filter(Boolean),
      summaryAr: body.summary,
    },
    locale,
  )

  return jsonResponse({ session }, { status: 201 })
}
