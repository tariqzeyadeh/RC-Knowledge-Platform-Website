"use client"

import { useEffect, useState } from "react"
import { ClipboardCheck, Check, X, Clock, User2, Building2, ArrowLeft } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { DemoDataGate } from "@/components/shared"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { reviewPriorityKey, reviewStageKey } from "@/i18n/enum-maps"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/utils"

const stageStyleByKey: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  approval: "bg-sky-50 text-sky-700 border-sky-200",
  publish: "bg-emerald-50 text-emerald-700 border-emerald-200",
}
const priorityStyleByKey: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  normal: "bg-muted text-muted-foreground border-border",
}

const workflowKeys = ["draft", "review", "approval", "publish"] as const

export function ReviewPage() {
  const t = useT()
  const { dir } = useLocale()
  const { reviewQueue, refresh } = useLocalizedData()
  const [queue, setQueue] = useState(reviewQueue)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    setQueue(reviewQueue)
  }, [reviewQueue])

  async function handleReviewAction(id: string, action: "approve" | "return") {
    setActing(id)
    try {
      const response = await fetch(`/api/review-queue/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) return
      setQueue((items) => items.filter((item) => item.id !== id))
      await refresh()
    } finally {
      setActing(null)
    }
  }

  return (
    <AppShell
      title={t("pages.review.title")}
      description={t("pages.review.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.review.title") }]}
    >
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-center gap-2 p-5">
          {workflowKeys.map((key, i) => (
            <div key={key} className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm font-medium text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">{i + 1}</span>
                {t(`enums.reviewStage.${key}`)}
              </span>
              {i < workflowKeys.length - 1 && <ArrowLeft className={cn("h-4 w-4 text-muted-foreground", dir === "ltr" && "rotate-180")} />}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-foreground">{t("pages.review.queue")} ({queue.length})</h2>
        <p className="text-xs text-muted-foreground">{t("pages.review.queueHint")}</p>
      </div>

      <div className="space-y-3">
        <DemoDataGate>
        {queue.map((r) => {
          const stageKey = reviewStageKey[r.stage] ?? "draft"
          const priorityKey = reviewPriorityKey[r.priority] ?? "normal"
          return (
            <div key={r.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <ClipboardCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                    <span className="text-[11px] text-muted-foreground">· {r.type}</span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">{r.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />{r.submittedBy}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{r.department}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{r.submittedAt} · {r.sla}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", priorityStyleByKey[priorityKey])}>
                    {t("common.priority")} {t(`enums.reviewPriority.${priorityKey}`)}
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", stageStyleByKey[stageKey])}>
                    {t(`enums.reviewStage.${stageKey}`)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" disabled={acting === r.id} onClick={() => handleReviewAction(r.id, "return")}>
                  <X className="h-4 w-4" /> {t("pages.review.returnForEdit")}
                </Button>
                <Button size="sm" disabled={acting === r.id} onClick={() => handleReviewAction(r.id, "approve")}>
                  <Check className="h-4 w-4" /> {t("pages.review.approveAndPublish")}
                </Button>
              </div>
            </div>
          )
        })}
        </DemoDataGate>
      </div>
    </AppShell>
  )
}
