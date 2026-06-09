"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, FileText, Eye, Star, Clock, Sparkles, X } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ConfidentialityBadge } from "@/components/shared"
import { assets, categories, topSearches } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const suggestions = ["إدارة العقود", "قالب خطة مشروع", "محضر لجنة", "تقييم الموردين", "حوكمة البيانات", "درس مستفاد"]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"relevance" | "recent" | "popular">("relevance")

  const results = useMemo(() => {
    let r = assets
    if (query) {
      const q = query.toLowerCase()
      r = assets.filter((a) => `${a.title} ${a.summary} ${a.keywords.join(" ")} ${a.department}`.toLowerCase().includes(q))
    }
    const sorted = [...r]
    if (sort === "recent") sorted.sort((a, b) => b.updated.localeCompare(a.updated))
    if (sort === "popular") sorted.sort((a, b) => b.views - a.views)
    return sorted
  }, [query, sort])

  return (
    <AppShell
      title="البحث المتقدم والدلالي"
      description="بحث نصي كامل يفهم المعنى لا مجرد المطابقة، مع فهرسة ملفات PDF وWord وExcel وعروض العمل ودعم التعرف الضوئي OCR."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "البحث المتقدم" }]}
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب سؤالك أو الكلمات المفتاحية... مثال: كيف أعد محضر لجنة؟"
            className="h-14 rounded-xl pr-12 pl-10 text-base"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="مسح" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">اقتراحات:</span>
          {suggestions.map((s) => (
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
              {query ? <>نتائج عن «<span className="font-medium text-foreground">{query}</span>»</> : "كل الأصول المعرفية"} ({results.length})
            </p>
            <div className="flex gap-1">
              {(["relevance", "recent", "popular"] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={cn("rounded-md px-2.5 py-1 text-xs transition-colors",
                    sort === s ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:bg-muted")}>
                  {s === "relevance" ? "الأهمية" : s === "recent" ? "الأحدث" : "الأكثر اطلاعاً"}
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
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{a.views.toLocaleString("ar-SA")}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{a.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />آخر تحديث {a.updated}</span>
                  </div>
                </div>
              </Link>
            ))}
            {results.length === 0 && (
              <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
                لا توجد نتائج. جرّب مصطلحاً آخر — سيتم تسجيل عمليات البحث غير الناجحة لإثراء المحتوى لاحقاً.
              </div>
            )}
          </div>
        </div>

        {/* Side */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-gold" /> أكثر عمليات البحث
            </p>
            <ul className="space-y-3">
              {topSearches.map((t) => (
                <li key={t.term}>
                  <button onClick={() => setQuery(t.term)} className="w-full text-right">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground hover:text-primary">{t.term}</span>
                      <span className="text-muted-foreground">{t.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${t.success}%` }} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-secondary/40 p-4">
            <p className="text-sm font-semibold text-foreground">بحث دلالي ذكي</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              يدعم المحرك فهم المعنى باللغتين العربية والإنجليزية، والإكمال التلقائي، والتصفية حسب النوع والتاريخ والجهة،
              وفهرسة الملفات الممسوحة ضوئياً عبر تقنية OCR.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["NLP عربي", "OCR", "فلترة متقدمة", "ترتيب بالأهمية"].map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px] font-normal">{t}</Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
