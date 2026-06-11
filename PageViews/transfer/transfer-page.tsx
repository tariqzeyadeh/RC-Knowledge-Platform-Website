"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Repeat, Calendar, User2, FileOutput, Plus, CheckCircle2, Clock, FileEdit } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { FilterChip } from "@/components/shared"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { getTransferSessionTypes } from "@/config/transfer-session-types"
import { transferStatusKey } from "@/i18n/enum-maps"
import { ButtonLink } from "@/components/ui/button"
import { cn } from "@/utils"

const statusStyleByKey: Record<string, { cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  completed: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  scheduled: { cls: "bg-sky-50 text-sky-700 border-sky-200", icon: Clock },
  documenting: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: FileEdit },
}

const ALL_FILTER = "__all__"

export function TransferPage() {
  const t = useT()
  const { formatNumber, locale } = useLocale()
  const { transferSessions } = useLocalizedData()
  const transferSessionTypes = useMemo(() => getTransferSessionTypes(locale), [locale])
  const [domain, setDomain] = useState(ALL_FILTER)
  const [sessionType, setSessionType] = useState(ALL_FILTER)
  const domainFilters = [ALL_FILTER, ...Array.from(new Set(transferSessions.map((s) => s.domain)))]

  const filtered = useMemo(() => {
    return transferSessions.filter((s) => {
      const domainMatch = domain === ALL_FILTER || s.domain === domain
      const typeMatch = sessionType === ALL_FILTER || s.sessionType === sessionType
      return domainMatch && typeMatch
    })
  }, [domain, sessionType, transferSessions])

  return (
    <AppShell
      title={t("pages.transfer.title")}
      description={t("pages.transfer.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.transfer.title") }]}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("pages.transfer.sessionType")}</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label={t("pages.library.all")} active={sessionType === ALL_FILTER} onClick={() => setSessionType(ALL_FILTER)} />
              {transferSessionTypes.map((st) => (
                <FilterChip
                  key={st.id}
                  label={st.label}
                  active={sessionType === st.label}
                  onClick={() => setSessionType(st.label)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("pages.transfer.domain")}</p>
            <div className="flex flex-wrap gap-2">
              {domainFilters.map((d) => (
                <FilterChip
                  key={d}
                  label={d === ALL_FILTER ? t("pages.library.all") : d}
                  active={domain === d}
                  onClick={() => setDomain(d)}
                />
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{formatNumber(filtered.length)} {t("pages.transfer.sessionsCount")}</p>
            <ButtonLink href="/transfer/schedule"><Plus className="h-4 w-4" /> {t("pages.transfer.schedule")}</ButtonLink>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
                {t("pages.transfer.noSessions")}
              </div>
            ) : (
              filtered.map((s) => {
                const statusKey = transferStatusKey[s.status] ?? "scheduled"
                const st = statusStyleByKey[statusKey]
                const Icon = st.icon
                return (
                  <div key={s.id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:flex-row sm:items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Repeat className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
                        <span className="text-[11px] text-muted-foreground">· {s.sessionType}</span>
                        <span className="text-[11px] text-muted-foreground">· {s.domain}</span>
                      </div>
                      <Link href={`/transfer/${s.id}`} className="font-heading text-sm font-semibold text-foreground hover:text-primary">
                        {s.title}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />{s.expert}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{s.date}</span>
                        <span className="flex items-center gap-1.5"><FileOutput className="h-3.5 w-3.5" />{s.outputs} {t("common.documentedOutputs")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", st.cls)}>
                        <Icon className="h-3.5 w-3.5" /> {t(`enums.transferStatus.${statusKey}`)}
                      </span>
                      <ButtonLink href={`/transfer/${s.id}`} variant="outline" size="sm">{t("common.details")}</ButtonLink>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
