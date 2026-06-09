import { ClipboardCheck, Check, X, Clock, User2, Building2, ArrowLeft } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { reviewQueue } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const stageMap: Record<string, string> = {
  "مسودة": "bg-muted text-muted-foreground border-border",
  "مراجعة": "bg-amber-50 text-amber-700 border-amber-200",
  "اعتماد": "bg-sky-50 text-sky-700 border-sky-200",
}
const priorityMap: Record<string, string> = {
  "عالية": "bg-red-50 text-red-700 border-red-200",
  "متوسطة": "bg-amber-50 text-amber-700 border-amber-200",
  "عادية": "bg-muted text-muted-foreground border-border",
}

const workflow = ["مسودة", "مراجعة", "اعتماد", "نشر"]

export default function ReviewPage() {
  return (
    <AppShell
      title="المراجعة والاعتماد والنشر"
      description="سير عمل حوكمة رقمي: مسودة ← مراجعة ← اعتماد ← نشر، مع تعليقات وأسباب الرفض واتفاقية مستوى خدمة وسجل تدقيق لكل قرار."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "المراجعة والاعتماد" }]}
    >
      {/* Workflow visual */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-center gap-2 p-5">
          {workflow.map((w, i) => (
            <div key={w} className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm font-medium text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">{i + 1}</span>
                {w}
              </span>
              {i < workflow.length - 1 && <ArrowLeft className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-foreground">قائمة الانتظار ({reviewQueue.length})</h2>
        <p className="text-xs text-muted-foreground">مرتبة حسب الأولوية واتفاقية مستوى الخدمة</p>
      </div>

      <div className="space-y-3">
        {reviewQueue.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                  <span className="text-[11px] text-muted-foreground">· {r.type}</span>
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground">{r.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />{r.submittedBy}</span>
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{r.department}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{r.submittedAt} · {r.sla}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", priorityMap[r.priority])}>أولوية {r.priority}</span>
                <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", stageMap[r.stage])}>{r.stage}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm"><X className="h-4 w-4" /> إرجاع للتعديل</Button>
              <Button size="sm"><Check className="h-4 w-4" /> اعتماد ونشر</Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
