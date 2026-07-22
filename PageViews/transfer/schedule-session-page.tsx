"use client"

import { useEffect, useState } from "react"
import {
  Check, Repeat, User2, Calendar, ListChecks, ClipboardCheck,
  ArrowLeft, ArrowRight, CheckCircle2, FileText,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button, ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { cn } from "@/utils"

const stepKeys = ["typeDomain", "details", "agenda", "review"] as const

export function ScheduleSessionPage() {
  const t = useT()
  const { dir, dict } = useLocale()
  const { transferSessionTypes, domains, transferDurations, refresh } = useLocalizedData()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [sessionTypeId, setSessionTypeId] = useState("")
  const [domainId, setDomainId] = useState("")
  const [durationId, setDurationId] = useState("")
  const [title, setTitle] = useState("")
  const [expert, setExpert] = useState("")
  const [facilitator, setFacilitator] = useState(dict.shell.userName)
  const [department, setDepartment] = useState("")
  const [date, setDate] = useState("")
  const [attendees, setAttendees] = useState("12")
  const [summary, setSummary] = useState("")
  const [agenda, setAgenda] = useState(["", ""])
  const [scheduledId, setScheduledId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const emDash = t("common.emDash")

  useEffect(() => {
    if (!sessionTypeId && transferSessionTypes[0]) setSessionTypeId(transferSessionTypes[0].id)
    if (!domainId && domains[0]) setDomainId(domains[0].id)
    if (!durationId && transferDurations[0]) setDurationId(transferDurations[0].id)
  }, [sessionTypeId, domainId, durationId, transferSessionTypes, domains, transferDurations])

  const selectedType = transferSessionTypes.find((item) => item.id === sessionTypeId)
  const selectedDomain = domains.find((item) => item.id === domainId)
  const selectedDuration = transferDurations.find((item) => item.id === durationId)

  async function handleSubmit() {
    if (!title.trim() || !expert.trim() || !date) return
    setSubmitting(true)
    try {
      const response = await fetch("/api/transfer-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          expert: expert.trim(),
          date,
          domainId,
          departmentLabel: department.trim() || undefined,
          durationId,
          facilitator: facilitator.trim(),
          sessionTypeId,
          attendees: Number(attendees) || 0,
          agenda: agenda.filter(Boolean),
          summary: summary.trim(),
        }),
      })
      if (!response.ok) throw new Error("schedule_failed")
      const payload = (await response.json()) as { session: { id: string } }
      setScheduledId(payload.session.id)
      await refresh()
      setDone(true)
    } catch {
      setSubmitting(false)
    }
  }
  if (done) {
    return (
      <AppShell breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.transfer.title"), href: "/transfer" },
        { label: t("pages.transfer.scheduleWizard.breadcrumb") },
      ]}>
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("pages.transfer.scheduleWizard.success.title")}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("pages.transfer.scheduleWizard.success.description").replace("{id}", scheduledId)}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/transfer">{t("common.returnToSessions")}</ButtonLink>
            {scheduledId ? <ButtonLink href={`/transfer/${scheduledId}`}>{t("common.details")}</ButtonLink> : null}
            <Button variant="outline" onClick={() => { setDone(false); setStep(1); setScheduledId("") }}>{t("common.scheduleAnother")}</Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title={t("pages.transfer.scheduleWizard.title")}
      description={t("pages.transfer.scheduleWizard.description")}
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.transfer.title"), href: "/transfer" },
        { label: t("pages.transfer.scheduleWizard.breadcrumb") },
      ]}
    >
      <div className="mx-auto max-w-3xl">
        <ol className="mb-8 flex items-center">
          {stepKeys.map((key, i) => {
            const id = i + 1
            const active = step === id
            const complete = step > id
            return (
              <li key={key} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    complete ? "border-primary bg-primary text-primary-foreground"
                      : active ? "border-primary text-primary" : "border-border text-muted-foreground",
                  )}>
                    {complete ? <Check className="h-4 w-4" /> : id}
                  </span>
                  <span className={cn("hidden text-[11px] sm:block", active || complete ? "text-foreground" : "text-muted-foreground")}>
                    {t(`pages.transfer.scheduleWizard.steps.${key}`)}
                  </span>
                </div>
                {i < stepKeys.length - 1 && (
                  <span className={cn("mx-2 h-0.5 flex-1", step > id ? "bg-primary" : "bg-border")} />
                )}
              </li>
            )
          })}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{t("pages.transfer.scheduleWizard.step1.title")}</h2>
                <p className="mb-5 text-sm text-muted-foreground">{t("pages.transfer.scheduleWizard.step1.description")}</p>
                {loading ? (
                  <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
                ) : error || transferSessionTypes.length === 0 ? (
                  <p className="text-sm text-destructive">{t("common.noResults")}</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {transferSessionTypes.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSessionTypeId(st.id)}
                        className={cn(
                          "rounded-lg border p-4 text-start transition-colors",
                          sessionTypeId === st.id ? "border-primary bg-secondary/50" : "border-border hover:border-primary/40",
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">{st.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{st.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="mb-3 font-heading text-base font-bold text-foreground">{t("pages.transfer.scheduleWizard.step1.domain")}</h3>
                <div className="flex flex-wrap gap-2">
                  {domains.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDomainId(item.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors",
                        domainId === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">{t("pages.transfer.scheduleWizard.step2.title")}</h2>
              <div>
                <Label htmlFor="title">{t("pages.transfer.scheduleWizard.step2.sessionTitle")}</Label>
                <Input id="title" className="mt-1.5" placeholder={t("pages.transfer.scheduleWizard.step2.sessionTitlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="summary">{t("pages.transfer.scheduleWizard.step2.summary")}</Label>
                <Textarea id="summary" className="mt-1.5" rows={2} placeholder={t("pages.transfer.scheduleWizard.step2.summaryPlaceholder")} value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="expert">{t("pages.transfer.scheduleWizard.step2.expert")}</Label>
                  <Input id="expert" className="mt-1.5" placeholder={t("pages.transfer.scheduleWizard.step2.expertPlaceholder")} value={expert} onChange={(e) => setExpert(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="facilitator">{t("pages.transfer.scheduleWizard.step2.facilitator")}</Label>
                  <Input id="facilitator" className="mt-1.5" value={facilitator} onChange={(e) => setFacilitator(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="department">{t("pages.transfer.scheduleWizard.step2.department")}</Label>
                  <Input id="department" className="mt-1.5" placeholder={t("pages.transfer.scheduleWizard.step2.departmentPlaceholder")} value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="attendees">{t("pages.transfer.scheduleWizard.step2.attendees")}</Label>
                  <Input id="attendees" type="number" min={1} className="mt-1.5" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date">{t("pages.transfer.scheduleWizard.step2.date")}</Label>
                  <Input id="date" type="date" className="mt-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label>{t("pages.transfer.scheduleWizard.step2.duration")}</Label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {transferDurations.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDurationId(item.id)}
                        className={cn(
                          "rounded-md border px-3 py-1.5 text-xs transition-colors",
                          durationId === item.id ? "border-primary bg-secondary/50 font-medium" : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{t("pages.transfer.scheduleWizard.step3.title")}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{t("pages.transfer.scheduleWizard.step3.description")}</p>
              <div className="space-y-3">
                {agenda.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                    <Input
                      value={item}
                      onChange={(e) => {
                        const next = [...agenda]
                        next[i] = e.target.value
                        setAgenda(next)
                      }}
                      placeholder={t("pages.transfer.scheduleWizard.step3.itemPlaceholder").replace("{n}", String(i + 1))}
                    />
                    {agenda.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setAgenda(agenda.filter((_, j) => j !== i))}>
                        {t("common.delete")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setAgenda([...agenda, ""])}>
                {t("common.addItem")}
              </Button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{t("pages.transfer.scheduleWizard.step4.title")}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{t("pages.transfer.scheduleWizard.step4.description")}</p>
              <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                <Row label={t("pages.transfer.scheduleWizard.review.sessionType")} value={selectedType?.label ?? ""} />
                <Row label={t("pages.transfer.scheduleWizard.review.domain")} value={selectedDomain?.label ?? emDash} />
                <Row label={t("pages.transfer.scheduleWizard.review.title")} value={title || emDash} />
                <Row label={t("pages.transfer.scheduleWizard.review.expert")} value={expert || emDash} />
                <Row label={t("pages.transfer.scheduleWizard.review.facilitator")} value={facilitator} />
                <Row label={t("pages.transfer.scheduleWizard.review.department")} value={department || emDash} />
                <Row label={t("pages.transfer.scheduleWizard.review.date")} value={date || emDash} />
                <Row label={t("pages.transfer.scheduleWizard.review.duration")} value={selectedDuration?.label ?? emDash} />
                <Row label={t("pages.transfer.scheduleWizard.review.attendees")} value={attendees} />
                <Row label={t("pages.transfer.scheduleWizard.review.agendaItems")} value={`${agenda.filter(Boolean).length} ${t("common.agendaItem")}`} />
              </dl>
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
                  <FileText className="h-3.5 w-3.5" /> {t("pages.transfer.scheduleWizard.step4.afterScheduleTitle")}
                </p>
                {t("pages.transfer.scheduleWizard.step4.afterSchedule")}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
              <ArrowRight className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /> {t("common.prev")}
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                {t("common.next")} <ArrowLeft className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                <Calendar className="h-4 w-4" /> {t("common.confirmSchedule")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 bg-card px-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-end font-medium text-foreground">{value}</dd>
    </div>
  )
}
