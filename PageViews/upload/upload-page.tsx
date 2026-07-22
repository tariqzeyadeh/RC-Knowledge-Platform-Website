"use client"

import { useEffect, useState } from "react"
import {
  Check, UploadCloud, FileText, Tag, ShieldCheck, ClipboardCheck, ArrowLeft, ArrowRight,
  Sparkles, CheckCircle2,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Button, ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils"

const stepKeys = ["typeAndTemplate", "uploadFile", "metadata", "classification", "reviewSubmit"] as const

export function UploadPage() {
  const t = useT()
  const { dir } = useLocale()
  const { categories, contentTemplates, confidentialityLevels, loading, error, refresh } = useLocalizedData()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdAssetId, setCreatedAssetId] = useState("")
  const [templateId, setTemplateId] = useState("")
  const [type, setType] = useState("")
  const [conf, setConf] = useState("internal")
  const [cat, setCat] = useState("")
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [keywords, setKeywords] = useState("")
  const [department, setDepartment] = useState("")
  const [nextReview, setNextReview] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (!templateId && contentTemplates[0]) {
      setTemplateId(contentTemplates[0].id)
      setType(contentTemplates[0].knowledgeType)
    }
    if (!cat && categories[0]?.id) setCat(categories[0].id)
  }, [templateId, cat, contentTemplates, categories])

  const selectedTemplate = contentTemplates.find((item) => item.id === templateId)

  async function handleSubmit() {
    if (!title.trim() || !summary.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const metadata = {
        titleAr: title.trim(),
        knowledgeTypeId: selectedTemplate?.knowledgeTypeId,
        knowledgeTypeLabel: type,
        categoryId: cat,
        confidentialityId: conf,
        summaryAr: summary.trim(),
        departmentLabel: department.trim() || undefined,
        keywordsAr: keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        nextReview: nextReview || undefined,
      }

      const formData = new FormData()
      formData.append("metadata", JSON.stringify(metadata))
      if (selectedFile) formData.append("file", selectedFile)

      const response = await fetch("/api/assets", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("upload_failed")
      const payload = (await response.json()) as { asset: { id: string } }
      setCreatedAssetId(payload.asset.id)
      await refresh()
      setDone(true)
    } catch {
      setSubmitError(t("common.noResults"))
      setSubmitting(false)
    }
  }

  function resetForm() {
    setDone(false)
    setStep(1)
    setSubmitting(false)
    setSubmitError(null)
    setCreatedAssetId("")
    setTitle("")
    setSummary("")
    setKeywords("")
    setDepartment("")
    setNextReview("")
    setSelectedFile(null)
    if (contentTemplates[0]) {
      setTemplateId(contentTemplates[0].id)
      setType(contentTemplates[0].knowledgeType)
    }
    if (categories[0]) setCat(categories[0].id)
    setConf("internal")
  }

  if (done) {
    return (
      <AppShell breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.upload.title") }]}>
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t("pages.upload.success.title")}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("pages.upload.success.description")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/review">{t("pages.upload.success.reviewQueue")}</ButtonLink>
            {createdAssetId ? <ButtonLink href={`/knowledge/${createdAssetId}`}>{t("common.details")}</ButtonLink> : null}
            <Button variant="outline" onClick={resetForm}>{t("common.submitAnother")}</Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title={t("pages.upload.title")}
      description={t("pages.upload.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.upload.title") }]}
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
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    complete ? "border-primary bg-primary text-primary-foreground"
                      : active ? "border-primary text-primary" : "border-border text-muted-foreground")}>
                    {complete ? <Check className="h-4 w-4" /> : id}
                  </span>
                  <span className={cn("hidden text-[11px] sm:block", active || complete ? "text-foreground" : "text-muted-foreground")}>
                    {t(`pages.upload.steps.${key}`)}
                  </span>
                </div>
                {i < stepKeys.length - 1 && <span className={cn("mx-2 h-0.5 flex-1", step > id ? "bg-primary" : "bg-border")} />}
              </li>
            )
          })}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{t("pages.upload.step1.title")}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{t("pages.upload.step1.description")}</p>
              {loading ? (
                <div className="rounded-lg border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                  {t("common.loading")}
                </div>
              ) : error || contentTemplates.length === 0 ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
                  {t("common.noResults")}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {contentTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setTemplateId(template.id)
                        setType(template.knowledgeType)
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-4 text-start transition-colors",
                        templateId === template.id
                          ? "border-primary bg-secondary/50"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                          templateId === template.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground",
                        )}
                      >
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">{template.name}</span>
                        <span className="mt-1 block text-xs text-primary">{template.knowledgeType}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {template.description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{t("pages.upload.step2.title")}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{t("pages.upload.step2.description")}</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:border-primary/50">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t("pages.upload.step2.dragDrop")}</span>
                <span className="text-xs text-muted-foreground">{t("pages.upload.step2.bulkHint")}</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {selectedFile ? (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · {t("pages.upload.step2.indexed")}
                    </p>
                  </div>
                  <Check className="h-5 w-5 text-primary" />
                </div>
              ) : null}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">{t("pages.upload.step3.title")}</h2>
              <div>
                <Label htmlFor="title">{t("pages.upload.step3.contentTitle")}</Label>
                <Input id="title" className="mt-1.5" placeholder={t("pages.upload.step3.contentTitlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="summary">{t("pages.upload.step3.summary")}</Label>
                <Textarea id="summary" className="mt-1.5" rows={3} placeholder={t("pages.upload.step3.summaryPlaceholder")} value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="kw">{t("pages.upload.step3.keywords")}</Label>
                <Input id="kw" className="mt-1.5" placeholder={t("pages.upload.step3.keywordsPlaceholder")} value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {t("pages.upload.step3.aiSuggest")}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dept">{t("pages.upload.step3.department")}</Label>
                  <Input id="dept" className="mt-1.5" placeholder={t("pages.upload.step3.departmentPlaceholder")} value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="review">{t("pages.upload.step3.nextReview")}</Label>
                  <Input id="review" type="date" className="mt-1.5" value={nextReview} onChange={(e) => setNextReview(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">{t("pages.upload.step4.classification")}</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((c) => (
                    <button key={c.id} onClick={() => setCat(c.id)}
                      className={cn("rounded-md border px-3 py-2.5 text-start text-sm transition-colors",
                        cat === c.id ? "border-primary bg-secondary/50 font-medium text-foreground" : "border-border text-muted-foreground hover:border-primary/40")}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">{t("pages.upload.step4.confidentiality")}</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {confidentialityLevels.map((l) => (
                    <button key={l.id} onClick={() => setConf(l.id)}
                      className={cn("flex items-center gap-2 rounded-md border px-3 py-2.5 text-start text-sm transition-colors",
                        conf === l.id ? "border-primary bg-secondary/50 font-medium text-foreground" : "border-border text-muted-foreground hover:border-primary/40")}>
                      <ShieldCheck className="h-4 w-4" /> {l.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">{t("pages.upload.step5.title")}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{t("pages.upload.step5.description")}</p>
              <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                <Row label={t("pages.upload.review.contentType")} value={selectedTemplate?.name ?? type} />
                <Row label={t("pages.upload.review.file")} value={selectedFile ? `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)` : t("common.emDash")} />
                <Row label={t("pages.upload.review.classification")} value={categories.find((c) => c.id === cat)?.name ?? ""} />
                <Row label={t("pages.upload.review.confidentiality")} value={confidentialityLevels.find((l) => l.id === conf)?.name ?? ""} />
                <Row label={t("pages.upload.review.destination")} value={t("pages.upload.review.destinationValue")} />
              </dl>
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                {t("pages.upload.step5.disclaimer")}
              </div>
            </div>
          )}

          {submitError ? (
            <p className="mt-4 text-sm text-destructive">{submitError}</p>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
              <ArrowRight className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /> {t("common.prev")}
            </Button>
            {step < 5 ? (
              <Button onClick={() => setStep((s) => s + 1)}>{t("common.next")} <ArrowLeft className={cn("h-4 w-4", dir === "ltr" && "rotate-180")} /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                <ClipboardCheck className="h-4 w-4" /> {t("pages.upload.submitReview")}
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
