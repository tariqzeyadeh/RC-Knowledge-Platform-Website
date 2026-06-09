import { ListChecks, ChevronUp, Building2, User2, Plus } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { needs } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusMap: Record<string, string> = {
  "جديد": "bg-sky-50 text-sky-700 border-sky-200",
  "قيد الإنتاج": "bg-amber-50 text-amber-700 border-amber-200",
  "منشور": "bg-emerald-50 text-emerald-700 border-emerald-200",
}
const priorityMap: Record<string, string> = {
  "عالية": "text-red-600",
  "متوسطة": "text-amber-600",
  "منخفضة": "text-muted-foreground",
}

export default function NeedsPage() {
  const sorted = [...needs].sort((a, b) => b.votes - a.votes)
  return (
    <AppShell
      title="الاحتياجات المعرفية"
      description="تحدد كل وحدة ما تحتاجه من معرفة أو أدلة غير متوفرة، فتُجمَّع الطلبات وتُرتَّب حسب الأولوية وتُسند مهمة إنتاج المحتوى للخبراء."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "الاحتياجات المعرفية" }]}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Stat label="طلبات جديدة" value={needs.filter((n) => n.status === "جديد").length} />
          <Stat label="قيد الإنتاج" value={needs.filter((n) => n.status === "قيد الإنتاج").length} />
          <Stat label="تم نشرها" value={needs.filter((n) => n.status === "منشور").length} />
        </div>
        <Button><Plus className="h-4 w-4" /> رفع احتياج معرفي</Button>
      </div>

      <div className="space-y-3">
        {sorted.map((n) => (
          <div key={n.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <button className="flex w-14 shrink-0 flex-col items-center rounded-md border border-border bg-muted/40 py-2 transition-colors hover:border-primary/40">
              <ChevronUp className="h-4 w-4 text-primary" />
              <span className="font-heading text-sm font-bold text-foreground">{n.votes}</span>
              <span className="text-[10px] text-muted-foreground">صوت</span>
            </button>
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground sm:flex">
              <ListChecks className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{n.id}</span>
                <span className={cn("text-[11px] font-medium", priorityMap[n.priority])}>● أولوية {n.priority}</span>
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground">{n.title}</h3>
              <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{n.unit}</span>
                <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" />مُسند إلى: {n.assignedTo}</span>
              </div>
            </div>
            <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium", statusMap[n.status])}>{n.status}</span>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-2.5">
      <p className="font-heading text-lg font-bold text-foreground">{value.toLocaleString("ar-SA")}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
