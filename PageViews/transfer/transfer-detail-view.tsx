"use client"

import type React from "react"
import Link from "next/link"
import {
  Repeat, Calendar, User2, FileOutput, ArrowLeft, Clock, Building2,
  Users, ListChecks, HelpCircle, FileText, CheckCircle2, FileEdit,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { DemoDataGate } from "@/components/shared"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { outputStatusKey, transferStatusKey } from "@/i18n/enum-maps"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/utils"

const statusStyleByKey: Record<string, { cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  completed: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  scheduled: { cls: "bg-sky-50 text-sky-700 border-sky-200", icon: Clock },
  documenting: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: FileEdit },
}

const outputStatusStyleByKey: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  underReview: "bg-amber-50 text-amber-700 border-amber-200",
  draft: "bg-muted text-muted-foreground border-border",
}

export function TransferDetailView({ id }: { id: string }) {
  const t = useT()
  const { dir } = useLocale()
  const { getTransferSession } = useLocalizedData()
  const session = getTransferSession(id)
  if (!session) return null

  const statusKey = transferStatusKey[session.status] ?? "scheduled"
  const st = statusStyleByKey[statusKey]
  const StatusIcon = st.icon

  const pathSteps = [
    { key: "schedule" as const, done: true },
    { key: "conduct" as const, done: statusKey !== "scheduled" },
    { key: "document" as const, done: statusKey === "completed" },
    { key: "approve" as const, done: statusKey === "completed" && session.outputs > 0 },
  ]

  return (
    <AppShell
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.transfer.title"), href: "/transfer" },
        { label: session.id },
      ]}
    >
      <DemoDataGate>
      <div className="mb-6">
        <Link href="/transfer" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} /> {t("common.backToSessions")}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Repeat className="h-7 w-7" />
            </span>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{session.id}</span>
                <Badge variant="secondary">{session.domain}</Badge>
                <Badge variant="secondary">{session.sessionType}</Badge>
                <Badge variant="outline" className="font-mono text-[10px]">F-02</Badge>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", st.cls)}>
                  <StatusIcon className="h-3.5 w-3.5" /> {t(`enums.transferStatus.${statusKey}`)}
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{session.title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{session.summary}</p>
            </div>
          </div>
          {statusKey === "documenting" && (
            <Button>{t("common.completeDocumentation")}</Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />{session.expert}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{session.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{session.duration}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{session.attendees} {t("common.attendee")}</span>
          <span className="flex items-center gap-1.5"><FileOutput className="h-3.5 w-3.5" />{session.outputs} {t("common.outputs")}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <ListChecks className="h-4 w-4" /> {t("pages.transfer.detail.agenda")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {session.agenda.map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {session.keyQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <HelpCircle className="h-4 w-4" /> {t("pages.transfer.detail.keyQuestions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {session.keyQuestions.map((q) => (
                  <p key={q} className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">{q}</p>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <FileText className="h-4 w-4" /> {t("pages.transfer.detail.documentedOutputs")}
              </CardTitle>
              {statusKey !== "scheduled" && (
                <Button variant="outline" size="sm">{t("common.addOutput")}</Button>
              )}
            </CardHeader>
            <CardContent>
              {session.documentedOutputs.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("pages.transfer.detail.noOutputs")}</p>
              ) : (
                <div className="space-y-3">
                  {session.documentedOutputs.map((o) => {
                    const outputKey = outputStatusKey[o.status] ?? "draft"
                    return (
                      <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{o.title}</p>
                          <p className="text-[11px] text-muted-foreground">{o.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", outputStatusStyleByKey[outputKey])}>
                            {t(`enums.outputStatus.${outputKey}`)}
                          </span>
                          {o.assetId && (
                            <Link href={`/knowledge/${o.assetId}`}>
                              <Button variant="outline" size="sm">{t("common.viewInLibrary")}</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {session.nextSteps && (
            <Card className="border-sky-200 bg-sky-50/50">
              <CardHeader>
                <CardTitle className="font-heading text-base text-sky-900">{t("pages.transfer.detail.nextSteps")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-sky-800">{session.nextSteps}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.transfer.detail.sessionData")}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Meta label={t("pages.transfer.detail.meta.id")} value={session.id} mono />
              <Meta label={t("pages.transfer.detail.meta.department")} value={session.department} />
              <Meta label={t("pages.transfer.detail.meta.domain")} value={session.domain} />
              <Meta label={t("pages.transfer.detail.meta.sessionType")} value={session.sessionType} />
              <Meta label={t("pages.transfer.detail.meta.facilitator")} value={session.facilitator} />
              <Meta label={t("pages.transfer.detail.meta.expert")} value={session.expert} />
              <Meta label={t("pages.transfer.detail.meta.date")} value={session.date} />
              <Meta label={t("pages.transfer.detail.meta.duration")} value={session.duration} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.transfer.detail.documentationPath")}</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-e border-border pe-4 text-xs">
                {pathSteps.map((step, i) => (
                  <li key={step.key} className="relative">
                    <span className={cn(
                      "absolute -end-[21px] top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                      step.done ? "bg-primary" : "bg-muted-foreground/30",
                    )} />
                    <span className={step.done ? "font-medium text-foreground" : "text-muted-foreground"}>
                      {t(`pages.transfer.detail.path.${step.key}`)}
                    </span>
                    {i === 2 && statusKey === "documenting" && (
                      <Badge className="ms-2 text-[10px]">{t("common.inProgress")}</Badge>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
              <Building2 className="h-3.5 w-3.5" /> F-02
            </p>
            {t("pages.transfer.detail.f02Note")}
          </div>
        </aside>
      </div>
      </DemoDataGate>
    </AppShell>
  )
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-end text-foreground", mono && "font-mono")}>{value}</span>
    </div>
  )
}
