"use client"

import Link from "next/link"
import { Search, FileText, Eye, Star, Clock, Sparkles, X } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ConfidentialityBadge } from "@/components/shared"
import { useAssetSearch } from "@/hooks/use-asset-search"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"

export function SearchPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const { categories, topSearches, searchSuggestions } = useLocalizedData()
  const { query, setQuery, sort, setSort, results } = useAssetSearch()

  return (
    <AppShell
      title={t("pages.search.title")}
      description={t("pages.search.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.search.title") }]}
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("pages.search.placeholder")}
            className="h-14 rounded-xl pe-12 ps-10 text-base"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label={t("common.clearSearch")} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("pages.search.suggestions")}</span>
          {searchSuggestions.map((s) => (
            <button key={s} onClick={() => setQuery(s)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {query ? (
                <>{t("pages.search.resultsFor")} «<span className="font-medium text-foreground">{query}</span>»</>
              ) : (
                t("pages.search.allAssets")
              )}{" "}({results.length})
            </p>
            <div className="flex gap-1">
              {(["relevance", "recent", "popular"] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={cn("rounded-md px-2.5 py-1 text-xs transition-colors",
                    sort === s ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:bg-muted")}>
                  {s === "relevance" ? t("pages.search.sortRelevance") : s === "recent" ? t("pages.search.sortRecent") : t("pages.search.sortPopular")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {results.map((a) => (
              <Link key={a.id} href={`/knowledge/${a.id}`}
                className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{a.type}</span><span>·</span>
                    <span>{categories.find((c) => c.id === a.category)?.name}</span><span>·</span>
                    <span>{a.department}</span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{a.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <ConfidentialityBadge level={a.confidentiality} />
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(a.views)}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{a.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t("pages.search.lastUpdated")} {a.updated}</span>
                  </div>
                </div>
              </Link>
            ))}
            {results.length === 0 && (
              <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
                {t("pages.search.emptyState")}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-gold" /> {t("pages.search.topSearches")}
            </p>
            <ul className="space-y-3">
              {topSearches.map((item) => (
                <li key={item.term}>
                  <button onClick={() => setQuery(item.term)} className="w-full text-start">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground hover:text-primary">{item.term}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${item.success}%` }} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-secondary/40 p-4">
            <p className="text-sm font-semibold text-foreground">{t("pages.search.semanticTitle")}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t("pages.search.semanticDesc")}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(["nlp", "ocr", "advancedFilter", "relevanceSort"] as const).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{t(`pages.search.tags.${tag}`)}</Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
