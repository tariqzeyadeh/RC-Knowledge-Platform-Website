import { ScrollText, CheckCircle2, XCircle, Download, Search } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { auditLog } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function AuditPage() {
  return (
    <AppShell
      title="سجل التدقيق وتتبع الأنشطة"
      description="تسجيل كامل لأنشطة المستخدمين بطوابع زمنية غير قابلة للعبث: الدخول والخروج والقراءة والتعديل، مع تكامل SIEM وسياسة احتفاظ متوافقة مع NCA وNDMO."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "سجل التدقيق" }]}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ابحث في السجل بالمستخدم أو الإجراء أو العنصر..." className="pr-9" />
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4" /> تصدير السجل</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-right">
              <th className="px-4 py-3 font-medium text-muted-foreground">المعرّف</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">المستخدم</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">الإجراء</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">العنصر</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">الوقت</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">عنوان IP</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">النتيجة</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{a.user}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <span className="flex items-center gap-2"><ScrollText className="h-3.5 w-3.5" />{a.action}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.target}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.time}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.ip}</td>
                <td className="px-4 py-3 text-center">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    a.result === "نجاح" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
                    {a.result === "نجاح" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}{a.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        تُحفظ سجلات التدقيق بطوابع زمنية غير قابلة للتعديل وتُرسَل تلقائياً إلى نظام إدارة معلومات وأحداث الأمن (SIEM)
        وفق سياسة احتفاظ معتمدة.
      </p>
    </AppShell>
  )
}
