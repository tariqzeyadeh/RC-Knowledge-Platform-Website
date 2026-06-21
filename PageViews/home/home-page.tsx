"use client"

import Link from "next/link"
import {
  Library, Search, Users, ClipboardCheck, ChevronLeft, TrendingUp, TrendingDown,
  FolderKanban, FileSignature, ScrollText, Lightbulb, MonitorSmartphone, Scale, Target,
  Sparkles, ArrowUpRight, FilePlus2, Clock,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { AssetCard, SectionHeading } from "@/components/shared"
import { ActivityAreaChart, HealthPieChart } from "@/components/charts"
import { useAuth } from "@/hooks/use-auth"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonLink } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"
import type { UserRole } from "@/types/auth"

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Library, Search, Users, ClipboardCheck,
}
const catIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  FolderKanban, FileSignature, ScrollText, Lightbulb, Users, MonitorSmartphone, Scale, Target,
}

const KPI_BY_ROLE: Record<UserRole, string[]> = {
  seeker: ["Search", "Library"],
  contributor: ["Library", "ClipboardCheck", "Users"],
  reviewer: ["ClipboardCheck", "Library", "Search"],
  admin: ["Library", "Search", "Users", "ClipboardCheck"],
}

export function HomePage() {
  const t = useT()
  const { user } = useAuth()
  const role = user?.role ?? "seeker"
  const { dict, dir, formatNumber } = useLocale()
  const { kpis, seciLayers, assets, categories, monthlyActivity, contentHealth, topSearches, reviewQueue } = useLocalizedData()
  const org = dict.org
  const visibleKpis = kpis.filter((k) => KPI_BY_ROLE[role].includes(k.icon))

  return (
    <AppShell>
      <section className="animate-scale-in mb-8 overflow-hidden rounded-xl border border-border bg-primary text-primary-foreground">
        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -start-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl animate-float" aria-hidden="true" />
          <div className="relative max-w-2xl stagger-children">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse-soft" />
              {org.parent} — {org.name}
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-balance sm:text-4xl">
              {org.platform}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 text-pretty">
              {t("pages.home.heroDesc")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {role === "seeker" && (
                <>
                  <ButtonLink href="/search" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <Search className="h-4 w-4" />
                    {t("pages.home.startSearch")}
                  </ButtonLink>
                  <ButtonLink href="/library" variant="secondary" size="lg">
                    <Library className="h-4 w-4" />
                    {t("pages.home.browseLibrary")}
                  </ButtonLink>
                </>
              )}
              {role === "contributor" && (
                <>
                  <ButtonLink href="/upload" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <FilePlus2 className="h-4 w-4" />
                    {t("pages.home.addContribution")}
                  </ButtonLink>
                  <ButtonLink href="/library" variant="secondary" size="lg">
                    <Library className="h-4 w-4" />
                    {t("pages.home.browseLibrary")}
                  </ButtonLink>
                </>
              )}
              {role === "reviewer" && (
                <>
                  <ButtonLink href="/review" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <ClipboardCheck className="h-4 w-4" />
                    {t("pages.home.openReviewQueue")}
                  </ButtonLink>
                  <ButtonLink href="/library" variant="secondary" size="lg">
                    <Library className="h-4 w-4" />
                    {t("pages.home.browseLibrary")}
                  </ButtonLink>
                </>
              )}
              {role === "admin" && (
                <>
                  <ButtonLink href="/library" variant="secondary" size="lg">
                    <Library className="h-4 w-4" />
                    {t("pages.home.browseLibrary")}
                  </ButtonLink>
                  <ButtonLink href="/upload" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <FilePlus2 className="h-4 w-4" />
                    {t("pages.home.addContribution")}
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {role === "seeker" && (
        <section className="mb-10">
          <SectionHeading title={t("pages.home.topSearchesTitle")} />
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-3">
                {topSearches.slice(0, 5).map((item) => (
                  <li key={item.term}>
                    <Link href={`/search?q=${encodeURIComponent(item.term)}`} className="block">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground hover:text-primary">{item.term}</span>
                        <span className="text-muted-foreground">{item.count}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${item.success}%` }} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {role === "contributor" && (
        <section className="mb-10">
          <SectionHeading title={t("pages.home.myContributionsTitle")} />
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-xs text-muted-foreground">{t("pages.home.myContributionsDesc")}</p>
              {[
                { label: t("pages.home.contributionDraft"), status: "draft" as const },
                { label: t("pages.home.contributionReview"), status: "review" as const },
                { label: t("pages.home.contributionPublished"), status: "published" as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <Badge variant="secondary">{t(`presentation.status.${item.status}`)}</Badge>
                </div>
              ))}
              <ButtonLink href="/upload" variant="outline" size="sm" className="mt-2">
                <FilePlus2 className="h-4 w-4" />
                {t("pages.home.addContribution")}
              </ButtonLink>
            </CardContent>
          </Card>
        </section>
      )}

      {role === "reviewer" && (
        <section className="mb-10">
          <SectionHeading
            title={t("pages.home.pendingReviewTitle")}
            action={
              <Link href="/review" className="link-arrow hover:underline">
                {t("pages.home.viewQueue")}{" "}
                <ChevronLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} />
              </Link>
            }
          />
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-xs text-muted-foreground">{t("pages.home.pendingReviewDesc")}</p>
              {reviewQueue.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{item.submittedBy}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.sla}
                    </span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <section className={cn(
        "stagger-children mb-10 grid gap-4",
        visibleKpis.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3",
      )}>
        {visibleKpis.map((k) => {
          const Icon = kpiIcons[k.icon] ?? Library
          return (
            <Card key={k.icon} className="interactive-card group">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="icon-hover h-5 w-5" />
                  </span>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${k.up ? "text-primary" : "text-destructive"}`}>
                    {k.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {k.trend}
                  </span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{k.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t(`kpi.${k.icon}`)}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="mb-10">
        <SectionHeading
          title={t("pages.home.seciTitle")}
          action={
            <Link href="/features" className="link-arrow hover:underline">
              {t("pages.home.featuresGuide")}{" "}
              <ChevronLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} />
            </Link>
          }
        />
        <div className="stagger-children grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {seciLayers.map((layer, i) => (
            <Card key={layer.id} className="interactive-card group relative overflow-hidden">
              <span className="absolute inset-y-0 end-0 w-1" style={{ background: layer.color }} aria-hidden="true" />
              <CardContent className="p-5 pe-6">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                    style={{ background: layer.color }}>{i + 1}</span>
                  <span className="text-[11px] text-muted-foreground">{layer.knowledgeType}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">{layer.title}</h3>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{layer.seci}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{layer.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {role === "admin" && (
        <section className="stagger-children mb-10 grid gap-6 lg:grid-cols-5">
          <Card className="interactive-card min-w-0 lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-heading text-base">{t("pages.home.monthlyActivity")}</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
              <ActivityAreaChart data={monthlyActivity} />
            </CardContent>
          </Card>
          <Card className="interactive-card min-w-0 lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading text-base">{t("pages.home.contentHealth")}</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
              <HealthPieChart data={contentHealth} />
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mb-10">
        <SectionHeading
          title={t("pages.home.recentAssets")}
          action={
            <Link href="/library" className="link-arrow hover:underline">
              {t("common.viewAll")}{" "}
              <ChevronLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} />
            </Link>
          }
        />
        <div className="stagger-children grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {assets.filter((a) => a.status === "published").slice(0, 4).map((a) => (
            <AssetCard key={a.id} asset={a} categoryName={categories.find((c) => c.id === a.category)?.name} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title={t("pages.home.categories")}
          action={
            <Link href="/library" className="link-arrow hover:underline">
              {t("pages.home.fullLibrary")}{" "}
              <ChevronLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} />
            </Link>
          }
        />
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = catIcons[c.icon] ?? FolderKanban
            return (
              <Link key={c.id} href={`/library?cat=${c.id}`}
                className="interactive-card group flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="icon-hover h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="truncate font-heading text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">{c.name}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-primary rtl:group-hover:translate-x-0.5 ltr:group-hover:-translate-x-0.5" />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatNumber(c.count)} {t("common.assets")}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}
