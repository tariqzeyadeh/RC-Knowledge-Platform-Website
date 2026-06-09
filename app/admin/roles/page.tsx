import { ShieldCheck, Check, Minus, Users, Plus } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { roles } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const permLabels: { key: keyof (typeof roles)[number]["permissions"]; label: string }[] = [
  { key: "create", label: "إنشاء" },
  { key: "review", label: "مراجعة" },
  { key: "approve", label: "اعتماد" },
  { key: "publish", label: "نشر" },
  { key: "admin", label: "إدارة" },
]

export default function RolesPage() {
  return (
    <AppShell
      title="إدارة الصلاحيات والأدوار (RBAC)"
      description="تحديد من يستطيع إنشاء أو مراجعة أو اعتماد أو الاطلاع على المعرفة عبر مصفوفة صلاحيات مرنة تدعم التفويض المؤقت والمراجعة الدورية ومستويات السرية."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "الصلاحيات والأدوار" }]}
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{roles.length} أدوار معرّفة في النظام</p>
        <Button><Plus className="h-4 w-4" /> إضافة دور</Button>
      </div>

      {/* Role cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />{r.users.toLocaleString("ar-SA")}
                </span>
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground">{r.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {permLabels.filter((p) => r.permissions[p.key]).map((p) => (
                  <span key={p.key} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{p.label}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission matrix */}
      <h2 className="mb-4 font-heading text-base font-bold text-foreground">مصفوفة الصلاحيات</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-right">
              <th className="px-4 py-3 font-medium text-muted-foreground">الدور</th>
              {permLabels.map((p) => (
                <th key={p.key} className="px-4 py-3 text-center font-medium text-muted-foreground">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                {permLabels.map((p) => (
                  <td key={p.key} className="px-4 py-3 text-center">
                    {r.permissions[p.key] ? (
                      <Check className={cn("mx-auto h-4 w-4", "text-primary")} />
                    ) : (
                      <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
