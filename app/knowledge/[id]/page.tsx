import Link from "next/link"
import { notFound } from "next/navigation"
import {
  FileText, Eye, Star, Download, Share2, Bookmark, History, Building2, User2,
  Calendar, RefreshCw, ThumbsUp, ThumbsDown, Link2, ShieldAlert,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AssetCard, ConfidentialityBadge, StatusBadge } from "@/components/shared"
import { getAsset, getCategory, assets } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function generateStaticParams() {
  return assets.map((a) => ({ id: a.id }))
}

const versionHistory = [
  { v: "1.3", date: "2026-05-18", by: "عبدالعزيز العتيبي", note: "تحديث معايير الترجيح المالي ونماذج المحاضر." },
  { v: "1.2", date: "2026-01-12", by: "عبدالعزيز العتيبي", note: "إضافة قسم تقييم الأداء السابق للموردين." },
  { v: "1.1", date: "2025-08-04", by: "إدارة المشتريات", note: "مواءمة مع نظام المنافسات الجديد." },
  { v: "1.0", date: "2025-03-20", by: "إدارة المشتريات", note: "الإصدار الأول المعتمد." },
]

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const asset = getAsset(id)
  if (!asset) notFound()
  const category = getCategory(asset.category)
  const related = assets.filter((a) => a.id !== asset.id && (a.category === asset.category || a.type === asset.type)).slice(0, 3)

  return (
    <AppShell breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "مكتبة المعرفة", href: "/library" }, { label: asset.id }]}>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
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
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{asset.views.toLocaleString("ar-SA")} مشاهدة</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" />{asset.rating}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button><Download className="h-4 w-4" /> تحميل ({asset.fileType})</Button>
              <Button variant="outline"><Bookmark className="h-4 w-4" /> حفظ</Button>
              <Button variant="outline"><Share2 className="h-4 w-4" /> مشاركة</Button>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="mb-2 font-heading text-base font-bold text-foreground">الملخص</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{asset.summary}</p>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 font-heading text-base font-bold text-foreground">الكلمات المفتاحية</h2>
              <div className="flex flex-wrap gap-2">
                {asset.keywords.map((k) => <Badge key={k} variant="secondary" className="font-normal">{k}</Badge>)}
              </div>
            </div>

            {/* Document preview placeholder */}
            <div className="mt-6 flex items-center gap-4 rounded-lg border border-dashed border-border bg-muted/40 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <FileText className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{asset.title}.{asset.fileType.toLowerCase()}</p>
                <p className="text-xs text-muted-foreground">مستند معتمد · الإصدار {asset.version} · فُهرس محتواه للبحث الكامل</p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <Card className="mt-6">
            <CardHeader><CardTitle className="font-heading text-base">هل كان هذا المحتوى مفيداً؟</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm"><ThumbsUp className="h-4 w-4" /> مفيد</Button>
              <Button variant="outline" size="sm"><ThumbsDown className="h-4 w-4" /> غير مفيد</Button>
              <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4" /> يحتاج تحديث</Button>
              <span className="mr-auto text-xs text-muted-foreground">تُجمع الملاحظات وتُعرض على مالك المحتوى تلقائياً.</span>
            </CardContent>
          </Card>

          {/* Version history */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base"><History className="h-4 w-4" /> سجل الإصدارات</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-r border-border pr-5">
                {versionHistory.map((v, i) => (
                  <li key={v.v} className="relative">
                    <span className={`absolute -right-[26px] top-1 h-3 w-3 rounded-full border-2 border-card ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">v{v.v}</span>
                      {i === 0 && <Badge className="bg-primary text-primary-foreground text-[10px]">الحالي</Badge>}
                      <span className="text-xs text-muted-foreground">{v.date} · {v.by}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.note}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-heading text-base">بيانات وصفية</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Meta icon={<FileText className="h-4 w-4" />} label="المعرّف" value={asset.id} mono />
              <Meta icon={<RefreshCw className="h-4 w-4" />} label="الإصدار" value={asset.version} mono />
              <Meta icon={<Calendar className="h-4 w-4" />} label="آخر تحديث" value={asset.updated} />
              <Meta icon={<Calendar className="h-4 w-4" />} label="المراجعة القادمة" value={asset.nextReview} />
              <Meta icon={<Building2 className="h-4 w-4" />} label="الإدارة المالكة" value={asset.department} />
            </CardContent>
          </Card>

          {asset.confidentiality !== "public" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <p className="flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4" /> محتوى مصنّف</p>
              <p className="mt-1.5 text-xs leading-relaxed">
                هذا المحتوى مصنّف على مستوى «{asset.confidentiality === "internal" ? "داخلي" : asset.confidentiality === "confidential" ? "سري" : "سري للغاية"}».
                يُسجَّل كل اطلاع أو تحميل في سجل التدقيق.
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base"><Link2 className="h-4 w-4" /> محتوى مترابط</CardTitle>
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
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">قد يهمّك أيضاً</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((r) => <AssetCard key={r.id} asset={r} categoryName={getCategory(r.category)?.name} />)}
        </div>
      </section>
    </AppShell>
  )
}

function Meta({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>
      <span className={`text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  )
}
