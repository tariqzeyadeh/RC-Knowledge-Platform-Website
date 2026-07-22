"use client"

import Link from "next/link"
import { Search, FileText, Eye, Star, Clock, Sparkles, X } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ConfidentialityBadge } from "@/components/shared"
import { useAssetSearch } from "@/hooks/use-asset-search"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils"

export function SearchPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const { categories, knowledgeTypes, topSearches, searchSuggestions, departments, fileTypes } = useLocalizedData()
  const {
    query, setQuery, sort, setSort, results,
    categoryId, setCategoryId, type, setType,
    department, setDepartment, fileType, setFileType,
    dateFrom, setDateFrom, dateTo, setDateTo,
    hasActiveFilters, clearFilters,
  } = useAssetSearch()

  return (
    <AppShell
      title={t("pages.search.title")}
      description={t("pages.search.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.search.title") }]}
    >
      <div className="min-w-0 max-w-full overflow-x-clip">
        <div className="relative w-full min-w-0">
          <Search className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("pages.search.placeholder")}
            className="h-14 w-full rounded-xl pe-12 ps-10 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label={t("common.clearSearch")}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <SearchFilterSelect
            label={t("pages.library.categories")}
            value={categoryId}
            onValueChange={setCategoryId}
            options={[
              { value: "all", label: t("pages.library.allCategories") },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <SearchFilterSelect
            label={t("pages.search.knowledgeType")}
            value={type}
            onValueChange={setType}
            options={[
              { value: "all", label: t("pages.library.all") },
              ...knowledgeTypes.map((kt) => ({ value: kt, label: kt })),
            ]}
          />
          <SearchFilterSelect
            label={t("pages.search.department")}
            value={department}
            onValueChange={setDepartment}
            options={[
              { value: "all", label: t("pages.search.allDepartments") },
              ...departments.map((d) => ({ value: d, label: d })),
            ]}
          />
          <SearchFilterSelect
            label={t("pages.search.fileFormat")}
            value={fileType}
            onValueChange={setFileType}
            options={[
              { value: "all", label: t("pages.search.allFormats") },
              ...fileTypes.map((ft) => ({ value: ft, label: ft })),
            ]}
          />
        </div>

        <div className="mt-2 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          <div className="flex h-8 w-full min-w-0 items-center gap-1.5 rounded-lg border border-input bg-card px-2 lg:col-span-2">
            <span className="shrink-0 text-xs text-muted-foreground">{t("pages.search.dateFrom")}</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-7 min-w-0 flex-1 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:shrink-0"
              aria-label={t("pages.search.dateFrom")}
            />
          </div>
          <div className="flex h-8 w-full min-w-0 items-center gap-1.5 rounded-lg border border-input bg-card px-2 lg:col-span-2">
            <span className="shrink-0 text-xs text-muted-foreground">{t("pages.search.dateTo")}</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-7 min-w-0 flex-1 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:shrink-0"
              aria-label={t("pages.search.dateTo")}
            />
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 w-full justify-self-end text-xs sm:col-span-2 lg:col-span-4 lg:w-auto">
              {t("pages.search.clearFilters")}
            </Button>
          )}
        </div>

        <div className="mt-3 flex w-full min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("pages.search.suggestions")}</span>
          {searchSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {query ? (
                <>
                  {t("pages.search.resultsFor")} «<span className="font-medium text-foreground">{query}</span>»
                </>
              ) : (
                t("pages.search.allAssets")
              )}{" "}
              ({results.length})
            </p>
            <div className="flex gap-1">
              {(["relevance", "recent", "popular"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs transition-colors",
                    sort === s
                      ? "bg-secondary font-medium text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s === "relevance"
                    ? t("pages.search.sortRelevance")
                    : s === "recent"
                      ? t("pages.search.sortRecent")
                      : t("pages.search.sortPopular")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {results.map((a) => (
              <Link
                key={a.id}
                href={`/knowledge/${a.id}`}
                className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{a.type}</span>
                    <span>·</span>
                    <span>{categories.find((c) => c.id === a.category)?.name}</span>
                    <span>·</span>
                    <span>{a.department}</span>
                    <span>·</span>
                    <span>{a.fileType}</span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary">
                    {a.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{a.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <ConfidentialityBadge level={a.confidentiality} />
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(a.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {a.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t("pages.search.lastUpdated")} {a.updated}
                    </span>
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

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
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
        </aside>
        </div>
      </div>
    </AppShell>
  )
}

function SearchFilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const active = value !== "all"
  const selected = options.find((o) => o.value === value)

  return (
    <div className="min-w-0">
      <Select value={value} onValueChange={(v) => onValueChange(v ?? "all")}>
        <SelectTrigger
          size="sm"
          className={cn(
            "h-8 w-full max-w-full min-w-0 gap-1 overflow-hidden bg-card text-xs",
            active && "border-primary/50 bg-secondary/50",
          )}
        >
          <span className="max-w-[38%] shrink-0 truncate text-muted-foreground">{label}:</span>
          <SelectValue className="min-w-0 flex-1 truncate text-start">{selected?.label ?? label}</SelectValue>
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          alignItemWithTrigger={false}
          sideOffset={4}
          className="max-h-64"
        >
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
