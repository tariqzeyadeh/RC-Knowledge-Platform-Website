"use client"

import Link from "next/link"
import {
  Library, Search, Users, ClipboardCheck, ChevronLeft, TrendingUp, TrendingDown,
  FolderKanban, FileSignature, ScrollText, Lightbulb, MonitorSmartphone, Scale, Target,
  Sparkles, ArrowUpRight, FilePlus2,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { AssetCard, SectionHeading } from "@/components/shared"
import { ActivityAreaChart, HealthPieChart } from "@/components/charts"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonLink } from "@/components/ui/button"
import { cn } from "@/utils"

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Library, Search, Users, ClipboardCheck,
}
const catIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  FolderKanban, FileSignature, ScrollText, Lightbulb, Users, MonitorSmartphone, Scale, Target,
}

export function HomePage() {
  const t = useT()
  const { dict, dir, formatNumber } = useLocale()
  const { kpis, seciLayers, assets, categories, monthlyActivity, contentHealth } = useLocalizedData()
  const org = dict.org

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
              <ButtonLink href="/library" variant="secondary" size="lg">
                <Library className="h-4 w-4" />
                {t("pages.home.browseLibrary")}
              </ButtonLink>
              <ButtonLink href="/upload" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <FilePlus2 className="h-4 w-4" />
                {t("pages.home.addContribution")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="stagger-children mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
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
