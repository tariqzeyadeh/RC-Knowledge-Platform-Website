"use client"

import { useState } from "react"
import {
  Check, Users, Target, BookOpen, ClipboardCheck,
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

const stepKeys = ["basics", "goalsTopics", "charter", "review"] as const

export function CreateCommunityPage() {
  const t = useT()
  const { dir, dict, formatList } = useLocale()
  const { categories } = useLocalizedData()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [name, setName] = useState("")
  const [domain, setDomain] = useState(categories[0]?.id ?? "")
  const [desc, setDesc] = useState("")
  const [owner, setOwner] = useState(dict.shell.userName)
  const [objectives, setObjectives] = useState(["", ""])
  const [topics, setTopics] = useState<string[]>([])
  const [charter, setCharter] = useState("")
  const [moderators, setModerators] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const topicOptions = categories.find((c) => c.id === domain)?.topics ?? []
  const emDash = t("common.emDash")

  async function handleSubmit() {
    if (!name.trim() || !desc.trim()) return
    setSubmitting(true)
    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          domainId: domain,
          description: desc.trim(),
          owner: owner.trim(),
          objectives: objectives.filter(Boolean),
          topics,
          charter: charter.trim(),
          moderators: moderators.trim(),
        }),
      })
      if (!response.ok) throw new Error("create_community_failed")
      setDone(true)
    } catch {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <AppShell breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.communities.title"), href: "/communities" },
        { label: t("pages.communities.createWizard.breadcrumb") },
      ]}>
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("pages.communities.createWizard.success.title")}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("pages.communities.createWizard.success.description")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/communities">{t("common.returnToCommunities")}</ButtonLink>
            <Button variant="outline" onClick={() => { setDone(false); setStep(1) }}>{t("common.createAnother")}</Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title={t("pages.communities.createWizard.title")}
      description={t("pages.communities.createWizard.description")}
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.communities.title"), href: "/communities" },
        { label: t("pages.communities.createWizard.breadcrumb") },
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
                    {t(`pages.communities.createWizard.steps.${key}`)}
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
              <h2 className="font-heading text-lg font-bold text-foreground">{t("pages.communities.createWizard.basics.title")}</h2>
              <div>
                <Label htmlFor="name">{t("pages.communities.createWizard.basics.name")}</Label>
                <Input id="name" className="mt-1.5" placeholder={t("pages.communities.createWizard.basics.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>{t("pages.communities.createWizard.basics.domain")}</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setDomain(c.id); setTopics([]) }}
                      className={cn(
                        "rounded-md border px-3 py-2.5 text-start text-sm transition-colors",
                        domain === c.id ? "border-primary bg-secondary/50 font-medium" : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="desc">{t("pages.communities.createWizard.basics.description")}</Label>
                <Textarea id="desc" className="mt-1.5" rows={3} placeholder={t("pages.communities.createWizard.basics.descriptionPlaceholder")} value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="owner">{t("pages.communities.createWizard.basics.owner")}</Label>
                <Input id="owner" className="mt-1.5" value={owner} onChange={(e) => setOwner(e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">{t("pages.communities.createWizard.goals.title")}</h2>
                {objectives.map((obj, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <Input
                      value={obj}
                      onChange={(e) => {
                        const next = [...objectives]
                        next[i] = e.target.value
                        setObjectives(next)
                      }}
                      placeholder={`${t("common.objective")} ${i + 1}`}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setObjectives([...objectives, ""])}>{t("common.addObjective")}</Button>
              </div>
              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">{t("pages.communities.createWizard.goals.topics")}</h2>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setTopics((prev) => (prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]))}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-colors",
                        topics.includes(topic) ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">{t("pages.communities.createWizard.charter.title")}</h2>
              <div>
                <Label htmlFor="charter">{t("pages.communities.createWizard.charter.charterLabel")}</Label>
                <Textarea
                  id="charter"
                  className="mt-1.5"
                  rows={4}
                  placeholder={t("pages.communities.createWizard.charter.charterPlaceholder")}
                  value={charter}
                  onChange={(e) => setCharter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="moderators">{t("pages.communities.createWizard.charter.moderators")}</Label>
                <Input id="moderators" className="mt-1.5" placeholder={t("pages.communities.createWizard.charter.moderatorsPlaceholder")} value={moderators} onChange={(e) => setModerators(e.target.value)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="mb-5 font-heading text-lg font-bold text-foreground">{t("pages.communities.createWizard.review.title")}</h2>
              <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                <Row label={t("pages.communities.createWizard.review.name")} value={name || emDash} />
                <Row label={t("pages.communities.createWizard.review.domain")} value={categories.find((c) => c.id === domain)?.name ?? ""} />
                <Row label={t("pages.communities.createWizard.review.owner")} value={owner} />
                <Row label={t("pages.communities.createWizard.review.objectives")} value={`${objectives.filter(Boolean).length} ${t("common.objective")}`} />
                <Row label={t("pages.communities.createWizard.review.topics")} value={topics.length ? formatList(topics) : emDash} />
              </dl>
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                {t("pages.communities.createWizard.review.disclaimer")}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
              <ArrowRight className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /> {t("common.prev")}
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>{t("common.next")} <ArrowLeft className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                <ClipboardCheck className="h-4 w-4" /> {t("common.sendForReview")}
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
