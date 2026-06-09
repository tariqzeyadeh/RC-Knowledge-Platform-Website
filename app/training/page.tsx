import {
  GraduationCap, Clock, BookOpen, Users2, PlayCircle, FileText, Award, Download,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { trainingPrograms } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const levelMap: Record<string, string> = {
  "تمهيدي": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "متوسط": "bg-sky-50 text-sky-700 border-sky-200",
  "متقدم": "bg-amber-50 text-amber-700 border-amber-200",
}

const manuals = [
  { title: "دليل المستخدم العام", desc: "خطوات التصفح والبحث والمساهمة الأساسية.", icon: FileText },
  { title: "دليل المراجع والمعتمد", desc: "إدارة قائمة الاعتماد وسير عمل المراجعة.", icon: FileText },
  { title: "دليل مدير النظام", desc: "إدارة المستخدمين والصلاحيات والإعدادات.", icon: FileText },
]

export default function TrainingPage() {
  return (
    <AppShell
      title="التدريب وأدلة الاستخدام"
      description="برامج تدريبية مصممة حسب الدور مع أدلة PDF وفيديوهات قصيرة وتقييم تدريبي وشهادات، متاحة وقابلة للتحديث داخل المنصة."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "التدريب والأدلة" }]}
    >
      <h2 className="mb-4 font-heading text-base font-bold text-foreground">البرامج التدريبية</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {trainingPrograms.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <Badge variant="outline" className={cn("text-[11px]", levelMap[p.level])}>{p.level}</Badge>
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users2 className="h-3.5 w-3.5" /> {p.audience}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{p.duration}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{p.lessons} وحدات</span>
                <span className="flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5" />{p.format}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" className="flex-1"><PlayCircle className="h-4 w-4" /> ابدأ البرنامج</Button>
                <Button size="sm" variant="outline"><Award className="h-4 w-4" /> الشهادة</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-heading text-base font-bold text-foreground">أدلة الاستخدام (PDF)</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {manuals.map((m) => (
          <div key={m.title} className="flex flex-col rounded-lg border border-border bg-card p-5">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <m.icon className="h-5 w-5" />
            </span>
            <h3 className="font-heading text-sm font-semibold text-foreground">{m.title}</h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full"><Download className="h-4 w-4" /> تحميل الدليل</Button>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
