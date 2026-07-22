"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { AssetCard, ConfidentialityBadge, FilterChip, StatusBadge, DemoDataGate } from "@/components/shared"
import { useAssetFilters } from "@/hooks/use-asset-filters"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"
import Link from "next/link"

export function LibraryPage() {
  return (
    <Suspense fallback={<LibraryPageFallback />}>
      <LibraryPageContent />
    </Suspense>
  )
}

function LibraryPageFallback() {
  const t = useT()
  return (
    <AppShell
      title={t("pages.library.title")}
      description={t("pages.library.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.library.title") }]}
    >
      <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        {t("pages.library.loading")}
      </div>
    </AppShell>
  )
}

function LibraryPageContent() {
  const t = useT()
  const { formatNumber } = useLocale()
  const { assets, categories, knowledgeTypes, confidentialityLevels } = useLocalizedData()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("cat") ?? "all"
  const {
    query,
    setQuery,
    categoryId: cat,
    setCategoryId: setCat,
    type,
    setType,
    confidentiality: conf,
    setConfidentiality: setConf,
    results: filtered,
  } = useAssetFilters(initialCategory)
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <AppShell
      title={t("pages.library.title")}
      description={t("pages.library.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.library.title") }]}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4" /> {t("pages.library.categories")}
            </p>
            <ul className="space-y-1">
              <FilterItem label={t("pages.library.allCategories")} count={assets.length} active={cat === "all"} onClick={() => setCat("all")} formatNumber={formatNumber} />
              {categories.map((c) => (
                <FilterItem key={c.id} label={c.name} count={c.count} active={cat === c.id} onClick={() => setCat(c.id)} formatNumber={formatNumber} />
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("pages.library.knowledgeType")}</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label={t("pages.library.all")} active={type === "all"} onClick={() => setType("all")} />
              {knowledgeTypes.map((kt) => (
                <FilterChip key={kt} label={kt} active={type === kt} onClick={() => setType(kt)} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("pages.library.confidentiality")}</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label={t("pages.library.all")} active={conf === "all"} onClick={() => setConf("all")} />
              {confidentialityLevels.map((l) => (
                <FilterChip key={l.id} label={l.name} active={conf === l.id} onClick={() => setConf(l.id)} />
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("pages.library.searchPlaceholder")}
                className="pe-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{filtered.length} {t("common.results")}</span>
              <div className="flex rounded-md border border-border p-0.5">
                <button onClick={() => setView("grid")} aria-label={t("pages.library.gridView")}
                  className={cn("rounded p-1.5", view === "grid" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground")}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setView("list")} aria-label={t("pages.library.listView")}
                  className={cn("rounded p-1.5", view === "list" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground")}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <DemoDataGate>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              {t("common.noResults")}
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((a) => (
                <AssetCard key={a.id} asset={a} categoryName={categories.find((c) => c.id === a.category)?.name} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {filtered.map((a) => (
                <Link key={a.id} href={`/knowledge/${a.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{a.type}</span><span>·</span><span>{a.department}</span>
                    </div>
                    <h3 className="truncate font-heading text-sm font-semibold text-foreground">{a.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {a.keywords.slice(0, 3).map((k) => <Badge key={k} variant="secondary" className="text-[10px] font-normal">{k}</Badge>)}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <ConfidentialityBadge level={a.confidentiality} />
                    <StatusBadge status={a.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
          </DemoDataGate>
        </div>
      </div>
    </AppShell>
  )
}

function FilterItem({ label, count, active, onClick, formatNumber }: { label: string; count: number; active: boolean; onClick: () => void; formatNumber: (value: number) => string }) {
  return (
    <li>
      <button onClick={onClick}
        className={cn("flex w-full items-center justify-between rounded-md px-2.5 py-2 text-start text-sm transition-colors",
          active ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:bg-muted")}>
        <span className="truncate">{label}</span>
        <span className="text-[11px]">{formatNumber(count)}</span>
      </button>
    </li>
  )
}
