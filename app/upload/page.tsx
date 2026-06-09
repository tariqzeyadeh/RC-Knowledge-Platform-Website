"use client"

import { useState } from "react"
import {
  Check, UploadCloud, FileText, Tag, ShieldCheck, ClipboardCheck, ArrowLeft, ArrowRight,
  Sparkles, CheckCircle2,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { categories, knowledgeTypes, confidentialityLevels, knowledgeTypes as types } from "@/lib/data"
import { Button, ButtonLink } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "النوع والقالب", icon: FileText },
  { id: 2, label: "رفع الملف", icon: UploadCloud },
  { id: 3, label: "البيانات الوصفية", icon: Tag },
  { id: 4, label: "التصنيف والسرية", icon: ShieldCheck },
  { id: 5, label: "المراجعة والإرسال", icon: ClipboardCheck },
]

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [type, setType] = useState(types[0])
  const [conf, setConf] = useState("internal")
  const [cat, setCat] = useState(categories[0].id)

  if (done) {
    return (
      <AppShell breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "إنشاء ورفع محتوى" }]}>
        <div className="mx-auto max-w-lg py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">تم إرسال المساهمة للمراجعة</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            دخلت مساهمتك سير عمل الاعتماد: مسودة ← مراجعة ← اعتماد ← نشر. سيصلك إشعار عند مراجعتها من قبل
            مراجع الإدارة المختصة وفق اتفاقية مستوى الخدمة.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/review">متابعة قائمة المراجعة</ButtonLink>
            <Button variant="outline" onClick={() => { setDone(false); setStep(1) }}>مساهمة أخرى</Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      title="إنشاء ورفع محتوى معرفي"
      description="حوّل خبرتك ومعلوماتك إلى أصل معرفي قابل لإعادة الاستخدام عبر خطوات موجَّهة مع حقول وصفية إلزامية."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "إنشاء ورفع محتوى" }]}
    >
      <div className="mx-auto max-w-3xl">
        {/* Stepper */}
        <ol className="mb-8 flex items-center">
          {steps.map((s, i) => {
            const active = step === s.id
            const complete = step > s.id
            return (
              <li key={s.id} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    complete ? "border-primary bg-primary text-primary-foreground"
                      : active ? "border-primary text-primary" : "border-border text-muted-foreground")}>
                    {complete ? <Check className="h-4 w-4" /> : s.id}
                  </span>
                  <span className={cn("hidden text-[11px] sm:block", active || complete ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <span className={cn("mx-2 h-0.5 flex-1", step > s.id ? "bg-primary" : "bg-border")} />}
              </li>
            )
          })}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">اختر نوع المحتوى والقالب</h2>
              <p className="mb-5 text-sm text-muted-foreground">القوالب الموحدة تضمن تنظيم المعرفة وسهولة فهرستها واسترجاعها.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {knowledgeTypes.map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={cn("flex items-center gap-3 rounded-lg border p-4 text-right transition-colors",
                      type === t ? "border-primary bg-secondary/50" : "border-border hover:border-primary/40")}>
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-md", type === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">رفع الملف</h2>
              <p className="mb-5 text-sm text-muted-foreground">يدعم PDF و Word و Excel و PowerPoint والصور. الملفات الممسوحة ضوئياً تُعالَج عبر OCR.</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:border-primary/50">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">اسحب الملف هنا أو اضغط للاختيار</span>
                <span className="text-xs text-muted-foreground">يدعم الرفع المجمّع · الحد الأقصى 50 ميجابايت للملف</span>
                <input type="file" className="hidden" />
              </label>
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">دليل-تقييم-الموردين.pdf</p>
                  <p className="text-xs text-muted-foreground">2.4 ميجابايت · تمت الفهرسة بنجاح</p>
                </div>
                <Check className="h-5 w-5 text-primary" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">البيانات الوصفية</h2>
              <div>
                <Label htmlFor="title">عنوان المحتوى *</Label>
                <Input id="title" className="mt-1.5" placeholder="مثال: دليل تقييم الموردين واختيار العروض" />
              </div>
              <div>
                <Label htmlFor="summary">الملخص *</Label>
                <Textarea id="summary" className="mt-1.5" rows={3} placeholder="وصف موجز لمحتوى الأصل المعرفي والغرض منه..." />
              </div>
              <div>
                <Label htmlFor="kw">الكلمات المفتاحية</Label>
                <Input id="kw" className="mt-1.5" placeholder="افصل بين الكلمات بفاصلة" />
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> اقترح الذكاء الاصطناعي: تقييم الموردين، المنافسات، معايير الترسية
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dept">الإدارة المالكة *</Label>
                  <Input id="dept" className="mt-1.5" placeholder="إدارة المشتريات" />
                </div>
                <div>
                  <Label htmlFor="review">تاريخ المراجعة القادمة *</Label>
                  <Input id="review" type="date" className="mt-1.5" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">التصنيف</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((c) => (
                    <button key={c.id} onClick={() => setCat(c.id)}
                      className={cn("rounded-md border px-3 py-2.5 text-right text-sm transition-colors",
                        cat === c.id ? "border-primary bg-secondary/50 font-medium text-foreground" : "border-border text-muted-foreground hover:border-primary/40")}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 font-heading text-lg font-bold text-foreground">مستوى السرية *</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {confidentialityLevels.map((l) => (
                    <button key={l.id} onClick={() => setConf(l.id)}
                      className={cn("flex items-center gap-2 rounded-md border px-3 py-2.5 text-right text-sm transition-colors",
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
              <h2 className="mb-1 font-heading text-lg font-bold text-foreground">المراجعة والإرسال</h2>
              <p className="mb-5 text-sm text-muted-foreground">تأكد من صحة البيانات قبل الإرسال إلى سير عمل الاعتماد.</p>
              <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                <Row label="نوع المحتوى" value={type} />
                <Row label="الملف" value="دليل-تقييم-الموردين.pdf (2.4MB)" />
                <Row label="التصنيف" value={categories.find((c) => c.id === cat)?.name ?? ""} />
                <Row label="مستوى السرية" value={confidentialityLevels.find((l) => l.id === conf)?.name ?? ""} />
                <Row label="الوجهة" value="مراجع إدارة المشتريات" />
              </dl>
              <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                بالضغط على «إرسال للمراجعة» تُسجَّل العملية في سجل التدقيق وتُحوَّل المساهمة إلى حالة «قيد المراجعة»
                ويصل إشعار تلقائي للمراجع المختص.
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
              <ArrowRight className="h-4 w-4" /> السابق
            </Button>
            {step < 5 ? (
              <Button onClick={() => setStep((s) => s + 1)}>التالي <ArrowLeft className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={() => setDone(true)}><ClipboardCheck className="h-4 w-4" /> إرسال للمراجعة</Button>
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
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}
