import { Scale, ShieldCheck, CheckCircle2, Clock, Lock, Server } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { complianceMatrix, securityControls } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function GovernancePage() {
  return (
    <AppShell
      title="الحوكمة والامتثال والأمن"
      description="توافق المنصة مع معيار ISO 30401 ومتطلبات NDMO وضوابط الأمن السيبراني NCA وأحكام هيئة الحكومة الرقمية، مع تشفير ونسخ احتياطي واستضافة داخلية لسيادة البيانات."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "الحوكمة والامتثال" }]}
    >
      {/* Compliance matrix */}
      <h2 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-foreground">
        <Scale className="h-5 w-5 text-primary" /> مصفوفة الامتثال للمعايير
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {complianceMatrix.map((c) => (
          <Card key={c.standard}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">{c.standard}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.scope}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  c.status === "متوافق" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                  {c.status === "متوافق" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{c.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">نسبة التغطية</span>
                <span className="font-bold text-foreground">{c.coverage}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", c.coverage >= 90 ? "bg-primary" : "bg-gold")} style={{ width: `${c.coverage}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security controls */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-base"><Lock className="h-5 w-5 text-primary" /> ضوابط الأمن وحماية البيانات</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {securityControls.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />{s.name}</span>
                  <span className="font-medium text-foreground">{s.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-base text-primary-foreground">
              <Server className="h-5 w-5" /> سيادة البيانات والاستضافة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-primary-foreground/85">
            <p>
              تُستضاف المنصة On-Premises داخل مركز بيانات المكتب لضمان سيادة المعلومات، مع بنية n-tier تفصل
              الطبقات وتدعم أكثر من 100 مستخدم متزامن باستجابة لا تتجاوز 3 ثوانٍ.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "RTO", v: "≤ 4 ساعات" },
                { k: "RPO", v: "≤ 24 ساعة" },
                { k: "التشفير", v: "AES-256 / TLS" },
                { k: "تكامل SIEM", v: "مفعّل" },
              ].map((x) => (
                <div key={x.k} className="rounded-lg bg-white/10 p-3">
                  <p className="text-[11px] text-primary-foreground/70">{x.k}</p>
                  <p className="font-heading text-base font-bold">{x.v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
