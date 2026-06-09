import { Repeat, Calendar, User2, FileOutput, Plus, CheckCircle2, Clock, FileEdit } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { transferSessions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusMap: Record<string, { cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  "مكتملة": { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  "مجدولة": { cls: "bg-sky-50 text-sky-700 border-sky-200", icon: Clock },
  "قيد التوثيق": { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: FileEdit },
}

export default function TransferPage() {
  return (
    <AppShell
      title="جلسات نقل المعرفة"
      description="جدولة جلسات نقل المعرفة من الموظفين المغادرين أو الخبراء، وتوثيق مخرجاتها وفق قوالب موحدة وتحويلها إلى محتوى معتمد."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "جلسات نقل المعرفة" }]}
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{transferSessions.length} جلسة مسجّلة</p>
        <Button><Plus className="h-4 w-4" /> جدولة جلسة</Button>
      </div>

      <div className="space-y-4">
        {transferSessions.map((s) => {
          const st = statusMap[s.status]
          const Icon = st.icon
          return (
            <div key={s.id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Repeat className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
                  <span className="text-[11px] text-muted-foreground">· {s.domain}</span>
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground">{s.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />{s.expert}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{s.date}</span>
                  <span className="flex items-center gap-1.5"><FileOutput className="h-3.5 w-3.5" />{s.outputs} مخرجات موثّقة</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", st.cls)}>
                  <Icon className="h-3.5 w-3.5" /> {s.status}
                </span>
                <Button variant="outline" size="sm">التفاصيل</Button>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
