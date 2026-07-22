"use client"

import { useEffect, useState } from "react"
import {
  Check, ListChecks, Target, ClipboardCheck,
  ArrowLeft, ArrowRight, CheckCircle2,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Button, ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils"

const stepKeys = ["describe", "justify", "review"] as const

export function CreateNeedPage() {
  const t = useT()
  const { dir } = useLocale()
  const { needUnits, needPriorities, loading, error, refresh } = useLocalizedData()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [title, setTitle] = useState("")
  const [unitId, setUnitId] = useState("")
  const [description, setDescription] = useState("")
  const [justification, setJustification] = useState("")
  const [expectedOutcome, setExpectedOutcome] = useState("")
  const [priorityId, setPriorityId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [createdNeedId, setCreatedNeedId] = useState("")
  const emDash = t("common.emDash")

  useEffect(() => {
    if (!unitId && needUnits[0]) setUnitId(needUnits[0].id)
    if (!priorityId && needPriorities[0]) setPriorityId(needPriorities[0].id)
  }, [unitId, priorityId, needUnits, needPriorities])

  const selectedUnit = needUnits.find((item) => item.id === unitId)
  const selectedPriority = needPriorities.find((item) => item.id === priorityId)

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !justification.trim() || !expectedOutcome.trim()) return
    setSubmitting(true)
    try {
      const response = await fetch("/api/needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          unitId,
          priorityId,
          description: description.trim(),
          justification: justification.trim(),
          expectedOutcome: expectedOutcome.trim(),
        }),
      })
      if (!response.ok) throw new Error("create_need_failed")
      const payload = (await response.json()) as { need: { id: string } }
      setCreatedNeedId(payload.need.id)
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
        { label: t("pages.needs.title"), href: "/needs" },
        { label: t("pages.needs.createWizard.breadcrumb") },
      ]}>
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("pages.needs.createWizard.success.title")}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("pages.needs.createWizard.success.description")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/needs">{t("common.returnToNeeds")}</ButtonLink>
            {createdNeedId ? <ButtonLink href={`/needs/${createdNeedId}`}>{t("common.details")}</ButtonLink> : null}
            <Button variant="outline" onClick={() => { setDone(false); setStep(1); setCreatedNeedId("") }}>{t("common.submitAnotherNeed")}</Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title={t("pages.needs.createWizard.title")}
      description={t("pages.needs.createWizard.description")}
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.needs.title"), href: "/needs" },
        { label: t("pages.needs.createWizard.breadcrumb") },
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
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold",
                    complete ? "border-primary bg-primary text-primary-foreground"
                      : active ? "border-primary text-primary" : "border-border text-muted-foreground",
                  )}>
                    {complete ? <Check className="h-4 w-4" /> : id}
                  </span>
                  <span className={cn("hidden text-[11px] sm:block", active || complete ? "text-foreground" : "text-muted-foreground")}>
                    {t(`pages.needs.createWizard.steps.${key}`)}
                  </span>
                </div>
                {i < stepKeys.length - 1 && <span className={cn("mx-2 h-0.5 flex-1", step > id ? "bg-primary" : "bg-border")} />}
              </li>
            )
          })}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">{t("pages.needs.createWizard.step1.title")}</h2>
              <div>
                <Label htmlFor="title">{t("pages.needs.createWizard.step1.needTitle")}</Label>
                <Input id="title" className="mt-1.5" placeholder={t("pages.needs.createWizard.step1.needTitlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>{t("pages.needs.createWizard.step1.unit")}</Label>
                {loading ? (
                  <p className="mt-2 text-sm text-muted-foreground">{t("common.loading")}</p>
                ) : error || needUnits.length === 0 ? (
                  <p className="mt-2 text-sm text-destructive">{t("common.noResults")}</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {needUnits.map((unit) => (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => setUnitId(unit.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs transition-colors",
                          unitId === unit.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {unit.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="description">{t("pages.needs.createWizard.step1.description")}</Label>
                <Textarea id="description" className="mt-1.5" rows={3} placeholder={t("pages.needs.createWizard.step1.descriptionPlaceholder")} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">{t("pages.needs.createWizard.step2.title")}</h2>
              <div>
                <Label htmlFor="justification">{t("pages.needs.createWizard.step2.justification")}</Label>
                <Textarea id="justification" className="mt-1.5" rows={3} placeholder={t("pages.needs.createWizard.step2.justificationPlaceholder")} value={justification} onChange={(e) => setJustification(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="outcome">{t("pages.needs.createWizard.step2.outcome")}</Label>
                <Textarea id="outcome" className="mt-1.5" rows={2} placeholder={t("pages.needs.createWizard.step2.outcomePlaceholder")} value={expectedOutcome} onChange={(e) => setExpectedOutcome(e.target.value)} />
              </div>
              <div>
                <Label>{t("common.priority")}</Label>
                <div className="mt-2 flex gap-2">
                  {needPriorities.map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() => setPriorityId(priority.id)}
                      className={cn(
                        "rounded-md border px-4 py-2 text-sm transition-colors",
                        priorityId === priority.id ? "border-primary bg-secondary/50 font-medium" : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-5 font-heading text-lg font-bold text-foreground">{t("pages.needs.createWizard.step3.title")}</h2>
              <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                <Row label={t("pages.needs.createWizard.review.title")} value={title || emDash} />
                <Row label={t("pages.needs.createWizard.review.unit")} value={selectedUnit?.label ?? emDash} />
                <Row label={t("pages.needs.createWizard.review.priority")} value={selectedPriority?.label ?? emDash} />
                <Row label={t("pages.needs.createWizard.review.description")} value={description ? `${description.slice(0, 60)}...` : emDash} />
              </dl>
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                {t("pages.needs.createWizard.step3.disclaimer")}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
              <ArrowRight className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /> {t("common.prev")}
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)}>{t("common.next")} <ArrowLeft className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                <ClipboardCheck className="h-4 w-4" /> {t("common.submitNeed")}
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
