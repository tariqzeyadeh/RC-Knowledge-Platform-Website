import "dotenv/config"

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000"

type Json = Record<string, unknown>

async function request(
  path: string,
  options: RequestInit & { cookie?: string } = {},
) {
  const headers = new Headers(options.headers)
  if (options.cookie) headers.set("cookie", options.cookie)
  const response = await fetch(`${BASE}${path}`, { ...options, headers })
  const text = await response.text()
  let body: Json | null = null
  try {
    body = text ? (JSON.parse(text) as Json) : null
  } catch {
    body = { raw: text }
  }
  const setCookie = response.headers.get("set-cookie") ?? ""
  const session = setCookie.match(/rc_session=([^;]+)/)?.[1]
  return { status: response.status, body, session, setCookie }
}

async function login(username: string, password: string) {
  const result = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (result.status !== 200 || !result.session) {
    throw new Error(`login_failed:${username}:${result.status}:${JSON.stringify(result.body)}`)
  }
  return `rc_session=${result.session}`
}

async function main() {
  const results: Array<{ name: string; ok: boolean; detail?: string }> = []

  function record(name: string, ok: boolean, detail?: string) {
    results.push({ name, ok, detail })
    console.log(ok ? `✓ ${name}` : `✗ ${name}${detail ? ` — ${detail}` : ""}`)
  }

  try {
    const bootstrap = await request("/api/platform/data?locale=ar")
    record("bootstrap", bootstrap.status === 200, `status ${bootstrap.status}`)
    const categories = (bootstrap.body?.categories as Array<{ id: string }>) ?? []
    const confidentialityLevels = (bootstrap.body?.confidentialityLevels as Array<{ id: string }>) ?? []
    const needUnits = (bootstrap.body?.needUnits as Array<{ id: string }>) ?? []
    const needPriorities = (bootstrap.body?.needPriorities as Array<{ id: string }>) ?? []
    const domains = (bootstrap.body?.domains as Array<{ id: string }>) ?? []
    const transferSessionTypes = (bootstrap.body?.transferSessionTypes as Array<{ id: string }>) ?? []
    const transferDurations = (bootstrap.body?.transferDurations as Array<{ id: string }>) ?? []

    const contributorCookie = await login("contributor", "contrib123")
    record("login contributor", true)

    const adminCookie = await login("admin", "admin123")
    record("login admin", true)

    const formData = new FormData()
    formData.append(
      "metadata",
      JSON.stringify({
        titleAr: `اختبار مساهمة ${Date.now()}`,
        categoryId: categories[0]?.id ?? "projects",
        confidentialityId: confidentialityLevels[0]?.id ?? "internal",
        summaryAr: "ملخص اختبار تلقائي للمساهمة",
        keywordsAr: ["اختبار"],
      }),
    )
    formData.append(
      "file",
      new Blob(["test upload content"], { type: "text/plain" }),
      "test.txt",
    )

    const upload = await request("/api/assets", {
      method: "POST",
      cookie: contributorCookie,
      body: formData,
    })
    const assetId = (upload.body?.asset as { id?: string } | undefined)?.id
    record("upload asset", upload.status === 201 && Boolean(assetId), `status ${upload.status}`)

    const reviewBefore = await request("/api/platform/data?locale=ar", { cookie: adminCookie })
    const reviewQueue = (reviewBefore.body?.reviewQueue as Array<{ id: string; assetId?: string }>) ?? []
    const createdReview = reviewQueue.find((item) => item.assetId === assetId)
    record("review queue contains upload", Boolean(createdReview), `queue size ${reviewQueue.length}`)

    if (createdReview) {
      const approve = await request(`/api/review-queue/${createdReview.id}`, {
        method: "POST",
        cookie: adminCookie,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      record("approve review item", approve.status === 200, `status ${approve.status}`)
    } else {
      record("approve review item", false, "missing review item")
    }

    const community = await request("/api/communities", {
      method: "POST",
      cookie: contributorCookie,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `مجتمع اختبار ${Date.now()}`,
        domainId: domains[0]?.id ?? "domain-projects",
        description: "وصف مجتمع اختبار",
        objectives: ["هدف 1"],
        topics: ["موضوع"],
        charter: "ميثاق",
      }),
    })
    const communityId = (community.body?.community as { id?: string } | undefined)?.id
    record("create community", community.status === 201 && Boolean(communityId), `status ${community.status}`)

    const need = await request("/api/needs", {
      method: "POST",
      cookie: contributorCookie,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `حاجة اختبار ${Date.now()}`,
        unitId: needUnits[0]?.id ?? "nu-km",
        priorityId: needPriorities[0]?.id ?? "np-medium",
        description: "وصف",
        justification: "مبرر",
        expectedOutcome: "نتيجة",
      }),
    })
    const needId = (need.body?.need as { id?: string } | undefined)?.id
    record("create need", need.status === 201 && Boolean(needId), `status ${need.status}`)

    if (needId) {
      const vote = await request(`/api/needs/${needId}`, {
        method: "PATCH",
        cookie: contributorCookie,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote" }),
      })
      const votes = (vote.body?.need as { votes?: number } | undefined)?.votes
      record("vote need", vote.status === 200 && (votes ?? 0) > 0, `votes ${votes}`)
    }

    const session = await request("/api/transfer-sessions", {
      method: "POST",
      cookie: contributorCookie,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `جلسة اختبار ${Date.now()}`,
        expert: "خبير",
        date: "2026-07-01",
        domainId: domains[0]?.id ?? "domain-projects",
        durationId: transferDurations[0]?.id ?? "td-60",
        facilitator: "منسق",
        sessionTypeId: transferSessionTypes[0]?.id ?? "tst-interview",
        attendees: 5,
        agenda: ["بند 1"],
        summary: "ملخص",
      }),
    })
    const sessionId = (session.body?.session as { id?: string } | undefined)?.id
    record("schedule session", session.status === 201 && Boolean(sessionId), `status ${session.status}`)

    const markRead = await request("/api/notifications", {
      method: "PATCH",
      cookie: adminCookie,
    })
    record("mark notifications read", markRead.status === 200, `status ${markRead.status}`)

    if (assetId) {
      const attachments = await request(
        `/api/attachments?entityType=knowledge_asset&entityId=${encodeURIComponent(assetId)}`,
        { cookie: adminCookie },
      )
      const count = ((attachments.body?.attachments as unknown[]) ?? []).length
      record("list attachments", attachments.status === 200 && count > 0, `count ${count}`)

      const asset = await request(`/api/assets/${assetId}`, { cookie: adminCookie })
      const status = (asset.body?.asset as { status?: string } | undefined)?.status
      record("published asset detail", asset.status === 200 && status === "published", `status ${status}`)

      const search = await request(`/api/search/suggestions?q=${encodeURIComponent("اختبار")}&limit=5`)
      const suggestions = ((search.body?.suggestions as unknown[]) ?? []).length
      record("search suggestions", search.status === 200, `count ${suggestions}`)
    }

    if (communityId) {
      const communityDetail = await request(`/api/communities/${communityId}`, { cookie: contributorCookie })
      record("get community", communityDetail.status === 200, `status ${communityDetail.status}`)
    }

    if (sessionId) {
      const sessionDetail = await request(`/api/transfer-sessions/${sessionId}`, { cookie: contributorCookie })
      record("get transfer session", sessionDetail.status === 200, `status ${sessionDetail.status}`)
    }

    const sessionCheck = await request("/api/auth/session", { cookie: adminCookie })
    const sessionUser = (sessionCheck.body?.user as { username?: string } | undefined)?.username
    record("auth session", sessionCheck.status === 200 && sessionUser === "admin", `user ${sessionUser}`)

    const logout = await request("/api/auth/logout", { method: "POST", cookie: adminCookie })
    record("logout", logout.status === 200, `status ${logout.status}`)

    const superAdminCookie = await login("superadmin", "superadmin123")
    record("login superadmin", true)

    const adminUsers = await request("/api/admin/users?locale=ar", { cookie: superAdminCookie })
    const userCount = ((adminUsers.body?.users as unknown[]) ?? []).length
    record("admin users list", adminUsers.status === 200 && userCount > 0, `count ${userCount}`)

    const failed = results.filter((item) => !item.ok)
    console.log(`\n${results.length - failed.length}/${results.length} passed`)
    if (failed.length) process.exit(1)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
