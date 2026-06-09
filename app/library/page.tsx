"use client"

import { useMemo, useState } from "react"
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AssetCard, ConfidentialityBadge, StatusBadge } from "@/components/shared"
import { assets, categories, knowledgeTypes, confidentialityLevels } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function LibraryPage() {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<string>("all")
  const [type, setType] = useState<string>("all")
  const [conf, setConf] = useState<string>("all")
  const [view, setView] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false
      if (type !== "all" && a.type !== type) return false
      if (conf !== "all" && a.confidentiality !== conf) return false
      if (query && !(`${a.title} ${a.summary} ${a.keywords.join(" ")}`.toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
  }, [query, cat, type, conf])

  return (
    <AppShell
      title="مكتبة المعرفة"
      description="تصفّح الأصول المعرفية المعتمدة وفلترتها حسب التصنيف والنوع ومستوى السرية."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "مكتبة المعرفة" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4" /> التصنيفات
            </p>
            <ul className="space-y-1">
              <FilterItem label="جميع التصنيفات" count={assets.length} active={cat === "all"} onClick={() => setCat("all")} />
              {categories.map((c) => (
                <FilterItem key={c.id} label={c.name} count={c.count} active={cat === c.id} onClick={() => setCat(c.id)} />
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">نوع المعرفة</p>
            <div className="flex flex-wrap gap-2">
              <Chip label="الكل" active={type === "all"} onClick={() => setType("all")} />
              {knowledgeTypes.map((t) => (
                <Chip key={t} label={t} active={type === t} onClick={() => setType(t)} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">مستوى السرية</p>
            <div className="flex flex-wrap gap-2">
              <Chip label="الكل" active={conf === "all"} onClick={() => setConf("all")} />
              {confidentialityLevels.map((l) => (
                <Chip key={l.id} label={l.name} active={conf === l.id} onClick={() => setConf(l.id)} />
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالعنوان أو الكلمات المفتاحية..."
                className="pr-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{filtered.length} نتيجة</span>
              <div className="flex rounded-md border border-border p-0.5">
                <button onClick={() => setView("grid")} aria-label="عرض شبكي"
                  className={cn("rounded p-1.5", view === "grid" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground")}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setView("list")} aria-label="عرض قائمة"
                  className={cn("rounded p-1.5", view === "list" ? "bg-secondary text-secondary-foreground" : "text-muted-foreground")}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              لا توجد نتائج مطابقة للفلاتر المحددة.
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
        </div>
      </div>
    </AppShell>
  )
}

function FilterItem({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button onClick={onClick}
        className={cn("flex w-full items-center justify-between rounded-md px-2.5 py-2 text-right text-sm transition-colors",
          active ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:bg-muted")}>
        <span className="truncate">{label}</span>
        <span className="text-[11px]">{count.toLocaleString("ar-SA")}</span>
      </button>
    </li>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn("rounded-full border px-3 py-1 text-xs transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40")}>
      {label}
    </button>
  )
}
