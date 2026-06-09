import {
  Library, Search, Users, ClipboardCheck, TrendingUp, TrendingDown, Download, FileBarChart,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import {
  kpis, monthlyActivity, departmentContribution, contentHealth, topSearches,
} from "@/lib/data"
import { ActivityAreaChart, SearchLineChart, DepartmentBarChart, HealthPieChart } from "@/components/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Library, Search, Users, ClipboardCheck,
}

export default function AnalyticsPage() {
  return (
    <AppShell
      title="لوحات المؤشرات والتقارير التحليلية"
      description="عرض بصري تفاعلي لمؤشرات أداء إدارة المعرفة يدعم التحسين المستمر ويوضح الفجوات والفرص، وقابل للتصدير والتكامل مع أنظمة ذكاء الأعمال."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "لوحات المؤشرات" }]}
    >
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm"><FileBarChart className="h-4 w-4" /> تقرير شهري</Button>
        <Button size="sm"><Download className="h-4 w-4" /> تصدير</Button>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = kpiIcons[k.icon] ?? Library
          return (
            <Card key={k.label}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${k.up ? "text-primary" : "text-destructive"}`}>
                    {k.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{k.trend}
                  </span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{k.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">نشاط النشر والمساهمات</CardTitle></CardHeader>
          <CardContent><ActivityAreaChart data={monthlyActivity} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">عمليات البحث الشهرية</CardTitle></CardHeader>
          <CardContent><SearchLineChart data={monthlyActivity} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">مساهمة الإدارات</CardTitle></CardHeader>
          <CardContent><DepartmentBarChart data={departmentContribution} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">صحّة المحتوى المعرفي</CardTitle></CardHeader>
          <CardContent><HealthPieChart data={contentHealth} /></CardContent>
        </Card>
      </div>

      {/* Top searches table */}
      <Card className="mt-6">
        <CardHeader><CardTitle className="font-heading text-base">أكثر مصطلحات البحث ومعدل النجاح</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSearches.map((t) => (
              <div key={t.term}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{t.term}</span>
                  <span className="text-xs text-muted-foreground">{t.count} بحث · نجاح {t.success}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${t.success >= 85 ? "bg-primary" : "bg-gold"}`} style={{ width: `${t.success}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
