"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FileText, Eye, Star, Download, Share2, Bookmark, History, Building2, User2,
  Calendar, RefreshCw, ThumbsUp, ThumbsDown, Link2, ShieldAlert,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { AssetCard, ConfidentialityBadge, StatusBadge, DemoDataGate } from "@/components/shared"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/utils"

export function KnowledgeDetailView({ id }: { id: string }) {
  const t = useT()
  const { formatNumber } = useLocale()
  const { assets, getAsset, getCategory } = useLocalizedData()
  const [attachments, setAttachments] = useState<Array<{ id: string; fileName: string; sizeBytes: number }>>([])
  const asset = getAsset(id)

  useEffect(() => {
    if (!asset) return
    fetch(`/api/attachments?entityType=knowledge_asset&entityId=${encodeURIComponent(id)}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return
        const payload = (await response.json()) as { attachments: Array<{ id: string; fileName: string; sizeBytes: number }> }
        setAttachments(payload.attachments)
      })
      .catch(() => {})
  }, [asset, id])

  if (!asset) return null

  const versionHistory: Array<{ v: string; date: string; by: string; note: string }> = []
  const primaryAttachment = attachments[0]

  const category = getCategory(asset.category)
  const related = assets.filter((a) => a.id !== asset.id && (a.category === asset.category || a.type === asset.type)).slice(0, 3)
  const confLabel = t(`presentation.confidentiality.${asset.confidentiality}`)

  return (
    <AppShell breadcrumb={[
      { label: t("common.home"), href: "/" },
      { label: t("pages.library.title"), href: "/library" },
      { label: asset.id },
    ]}>
      <DemoDataGate>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{asset.type}</Badge>
              {category && <Badge variant="secondary">{category.name}</Badge>}
              <ConfidentialityBadge level={asset.confidentiality} />
              <StatusBadge status={asset.status} />
            </div>

            <h1 className="font-heading text-2xl font-bold leading-snug text-foreground text-balance">{asset.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><User2 className="h-4 w-4" />{asset.author}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{asset.department}</span>
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatNumber(asset.views)} {t("common.views")}</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" />{asset.rating}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {primaryAttachment ? (
                <a
                  href={`/api/attachments?id=${primaryAttachment.id}`}
                  download={primaryAttachment.fileName}
                  className={cn(buttonVariants())}
                >
                  <Download className="h-4 w-4" /> {t("common.download")} ({asset.fileType})
                </a>
              ) : (
                <Button disabled><Download className="h-4 w-4" /> {t("common.download")} ({asset.fileType})</Button>
              )}
              <Button variant="outline"><Bookmark className="h-4 w-4" /> {t("common.bookmark")}</Button>
              <Button variant="outline"><Share2 className="h-4 w-4" /> {t("common.share")}</Button>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-2 font-heading text-base font-bold text-foreground">{t("pages.knowledgeDetail.summary")}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{asset.summary}</p>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 font-heading text-base font-bold text-foreground">{t("pages.knowledgeDetail.keywords")}</h2>
              <div className="flex flex-wrap gap-2">
                {asset.keywords.map((k) => <Badge key={k} variant="secondary" className="font-normal">{k}</Badge>)}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-lg border border-dashed border-border bg-muted/40 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <FileText className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {primaryAttachment?.fileName ?? `${asset.title}.${asset.fileType.toLowerCase()}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("pages.knowledgeDetail.approvedDoc").replace("{version}", asset.version)}
                  {primaryAttachment ? ` · ${Math.round(primaryAttachment.sizeBytes / 1024)} KB` : ""}
                </p>
              </div>
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.knowledgeDetail.feedback.title")}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm"><ThumbsUp className="h-4 w-4" /> {t("common.helpful")}</Button>
              <Button variant="outline" size="sm"><ThumbsDown className="h-4 w-4" /> {t("common.notHelpful")}</Button>
              <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4" /> {t("common.needsUpdate")}</Button>
              <span className="ms-auto text-xs text-muted-foreground">{t("pages.knowledgeDetail.feedback.note")}</span>
            </CardContent>
          </Card>

          {versionHistory.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base"><History className="h-4 w-4" /> {t("pages.knowledgeDetail.versionHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-e border-border pe-5">
                {versionHistory.map((v, i) => (
                  <li key={v.v} className="relative">
                    <span className={`absolute -end-[26px] top-1 h-3 w-3 rounded-full border-2 border-card ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">v{v.v}</span>
                      {i === 0 && <Badge className="bg-primary text-primary-foreground text-[10px]">{t("common.current")}</Badge>}
                      <span className="text-xs text-muted-foreground">{v.date} · {v.by}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.note}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          )}
        </article>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.knowledgeDetail.metadata")}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Meta icon={<FileText className="h-4 w-4" />} label={t("pages.knowledgeDetail.meta.id")} value={asset.id} mono />
              <Meta icon={<RefreshCw className="h-4 w-4" />} label={t("pages.knowledgeDetail.meta.version")} value={asset.version} mono />
              <Meta icon={<Calendar className="h-4 w-4" />} label={t("pages.knowledgeDetail.meta.updated")} value={asset.updated} />
              <Meta icon={<Calendar className="h-4 w-4" />} label={t("pages.knowledgeDetail.meta.nextReview")} value={asset.nextReview} />
              <Meta icon={<Building2 className="h-4 w-4" />} label={t("pages.knowledgeDetail.meta.department")} value={asset.department} />
            </CardContent>
          </Card>

          {asset.confidentiality !== "public" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <p className="flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4" /> {t("pages.knowledgeDetail.classified")}</p>
              <p className="mt-1.5 text-xs leading-relaxed">
                {t("pages.knowledgeDetail.classifiedNote").replace("{level}", confLabel)}
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base"><Link2 className="h-4 w-4" /> {t("pages.knowledgeDetail.related")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {related.map((r) => (
                <Link key={r.id} href={`/knowledge/${r.id}`} className="block rounded-md border border-border p-3 transition-colors hover:border-primary/40">
                  <p className="text-[11px] text-muted-foreground">{r.type}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs font-medium text-foreground">{r.title}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">{t("pages.knowledgeDetail.youMayLike")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((r) => <AssetCard key={r.id} asset={r} categoryName={getCategory(r.category)?.name} />)}
        </div>
      </section>
      </DemoDataGate>
    </AppShell>
  )
}

function Meta({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>
      <span className={`text-end text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
