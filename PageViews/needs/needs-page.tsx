"use client"

import { useState } from "react"
import Link from "next/link"
import { ListChecks, ChevronUp, Building2, User2, Plus } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { DemoDataGate } from "@/components/shared"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { needPriorityKey, needStatusKey } from "@/i18n/enum-maps"
import { ButtonLink } from "@/components/ui/button"
import { cn } from "@/utils"

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

export function NeedsPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const { needs, refresh } = useLocalizedData()
  const [votingId, setVotingId] = useState<string | null>(null)
  const sorted = [...needs].sort((a, b) => b.votes - a.votes)

  async function handleVote(id: string) {
    setVotingId(id)
    try {
      const response = await fetch(`/api/needs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote" }),
      })
      if (!response.ok) return
      await refresh()
    } finally {
      setVotingId(null)
    }
  }

  return (
    <AppShell
      title={t("pages.needs.title")}
      description={t("pages.needs.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.needs.title") }]}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DemoDataGate>
        <div className="flex gap-3">
          <Stat label={t("pages.needs.newRequests")} value={needs.filter((n) => needStatusKey[n.status] === "new").length} formatNumber={formatNumber} />
          <Stat label={t("pages.needs.inProduction")} value={needs.filter((n) => needStatusKey[n.status] === "inProduction").length} formatNumber={formatNumber} />
          <Stat label={t("pages.needs.published")} value={needs.filter((n) => needStatusKey[n.status] === "published").length} formatNumber={formatNumber} />
        </div>
        </DemoDataGate>
        <ButtonLink href="/needs/create"><Plus className="h-4 w-4" /> {t("pages.needs.create")}</ButtonLink>
      </div>

      <DemoDataGate>
      <div className="space-y-3">
        {sorted.map((n) => {
          const statusKey = needStatusKey[n.status] ?? "new"
          const priorityKey = needPriorityKey[n.priority] ?? "medium"
          return (
            <Link key={n.id} href={`/needs/${n.id}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
              <button
                type="button"
                disabled={votingId === n.id}
                onClick={(e) => { e.preventDefault(); void handleVote(n.id) }}
                className="flex w-14 shrink-0 flex-col items-center rounded-md border border-border bg-muted/40 py-2 transition-colors hover:border-primary/40 disabled:opacity-50"
              >
                <ChevronUp className="h-4 w-4 text-primary" />
                <span className="font-heading text-sm font-bold text-foreground">{n.votes}</span>
                <span className="text-[10px] text-muted-foreground">{t("pages.needs.vote")}</span>
              </button>
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground sm:flex">
                <ListChecks className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{n.id}</span>
                  <span className={cn("text-[11px] font-medium", priorityStyleByKey[priorityKey])}>
                    ● {t("pages.needs.priority")} {t(`enums.needPriority.${priorityKey}`)}
                  </span>
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground">{n.title}</h3>
                <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{n.unit}</span>
                  <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />{t("pages.needs.assignedTo")}: {n.assignedTo}</span>
                </div>
              </div>
              <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium", statusStyleByKey[statusKey])}>
                {t(`enums.needStatus.${statusKey}`)}
              </span>
            </Link>
          )
        })}
      </div>
      </DemoDataGate>
    </AppShell>
  )
}

function Stat({ label, value, formatNumber }: { label: string; value: number; formatNumber: (value: number) => string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-2.5">
      <p className="font-heading text-lg font-bold text-foreground">{formatNumber(value)}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
