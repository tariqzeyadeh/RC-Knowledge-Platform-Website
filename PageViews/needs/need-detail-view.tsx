"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  ListChecks, Building2, User2, Calendar, ArrowLeft, ChevronUp,
  Target, FileText, Clock,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { needPriorityKey, needStatusKey } from "@/i18n/enum-maps"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/utils"
import type { KnowledgeNeed } from "@/types/domain"

const statusStyleByKey: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  inProduction: "bg-amber-50 text-amber-700 border-amber-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const priorityStyleByKey: Record<string, string> = {
  high: "text-red-600",
  medium: "text-amber-600",
  low: "text-muted-foreground",
}

export function NeedDetailView({ id }: { id: string }) {
  const t = useT()
  const { dir } = useLocale()
  const { getNeed, getAsset, refresh } = useLocalizedData()
  const [need, setNeed] = useState<KnowledgeNeed | null>(getNeed(id) as KnowledgeNeed | null)
  const [loading, setLoading] = useState(!need)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/needs/${encodeURIComponent(id)}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("not_found")
        return response.json() as Promise<{ need: KnowledgeNeed }>
      })
      .then((payload) => {
        if (!cancelled) setNeed(payload.need)
      })
      .catch(() => {
        if (!cancelled) setNeed(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleVote() {
    if (!need) return
    setVoting(true)
    try {
      const response = await fetch(`/api/needs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "vote" }),
      })
      if (!response.ok) return
      const payload = (await response.json()) as { need: KnowledgeNeed }
      setNeed(payload.need)
      await refresh()
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <AppShell breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.needs.title"), href: "/needs" }, { label: id }]}>
        <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      </AppShell>
    )
  }

  if (!need) {
    return (
      <AppShell breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.needs.title"), href: "/needs" }, { label: id }]}>
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          {t("common.noResults")}
        </div>
      </AppShell>
    )
  }

  const statusKey = needStatusKey[need.status] ?? "new"
  const priorityKey = needPriorityKey[need.priority] ?? "medium"
  const linkedAsset = need.linkedAssetId ? getAsset(need.linkedAssetId) : undefined
  const emDash = t("common.emDash")

  const workflow = [
    { key: "submit" as const, done: true },
    { key: "vote" as const, done: need.votes > 0 },
    { key: "assign" as const, done: need.assignedTo !== emDash && need.assignedTo !== "—" },
    { key: "produce" as const, done: statusKey === "inProduction" || statusKey === "published" },
    { key: "publish" as const, done: statusKey === "published" },
  ]

  return (
    <AppShell
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.needs.title"), href: "/needs" },
        { label: need.id },
      ]}
    >
      <Link href="/needs" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} /> {t("common.backToNeeds")}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{need.id}</span>
            <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", statusStyleByKey[statusKey])}>
              {t(`enums.needStatus.${statusKey}`)}
            </span>
            <span className={cn("text-[11px] font-medium", priorityStyleByKey[priorityKey])}>
              ● {t("common.priority")} {t(`enums.needPriority.${priorityKey}`)}
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{need.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{need.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleVote}
            disabled={voting}
            className="flex flex-col items-center rounded-lg border border-border bg-card px-4 py-2 transition-colors hover:border-primary/40 disabled:opacity-60"
          >
            <ChevronUp className="h-5 w-5 text-primary" />
            <span className="font-heading text-lg font-bold">{need.votes}</span>
            <span className="text-[10px] text-muted-foreground">{t("common.vote")}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <Target className="h-4 w-4" /> {t("pages.needs.detail.justification")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="mb-1 font-medium text-foreground">{t("pages.needs.detail.whyNeed")}</p>
                <p className="leading-relaxed text-muted-foreground">{need.justification}</p>
              </div>
              <div>
                <p className="mb-1 font-medium text-foreground">{t("pages.needs.detail.expectedOutcome")}</p>
                <p className="leading-relaxed text-muted-foreground">{need.expectedOutcome}</p>
              </div>
            </CardContent>
          </Card>

          {linkedAsset && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <FileText className="h-4 w-4" /> {t("pages.needs.detail.publishedAsset")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/knowledge/${linkedAsset.id}`} className="block rounded-md border border-border p-3 transition-colors hover:border-primary/40">
                  <p className="text-[11px] text-muted-foreground">{linkedAsset.type}</p>
                  <p className="mt-0.5 font-medium text-foreground">{linkedAsset.title}</p>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.needs.detail.requestData")}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Meta icon={<Building2 className="h-4 w-4" />} label={t("pages.needs.detail.unit")} value={need.unit} />
              <Meta icon={<User2 className="h-4 w-4" />} label={t("pages.needs.detail.requestedBy")} value={need.requestedBy} />
              <Meta icon={<Calendar className="h-4 w-4" />} label={t("pages.needs.detail.requestedAt")} value={need.requestedAt} />
              <Meta icon={<User2 className="h-4 w-4" />} label={t("pages.needs.detail.assignedTo")} value={need.assignedTo} />
              {need.timeline && <Meta icon={<Clock className="h-4 w-4" />} label={t("pages.needs.detail.timeline")} value={need.timeline} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <ListChecks className="h-4 w-4" /> {t("pages.needs.detail.processingPath")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-e border-border pe-4 text-xs">
                {workflow.map((step) => (
                  <li key={step.key} className="relative">
                    <span className={cn(
                      "absolute -end-[21px] top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                      step.done ? "bg-primary" : "bg-muted-foreground/30",
                    )} />
                    <span className={step.done ? "font-medium text-foreground" : "text-muted-foreground"}>
                      {t(`pages.needs.detail.path.${step.key}`)}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  )
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>
      <span className="text-end text-foreground">{value}</span>
    </div>
  )
}
