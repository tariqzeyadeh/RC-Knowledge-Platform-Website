import { Users, MessageSquare, Crown, Plus, Circle } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { communities } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function CommunitiesPage() {
  const totalMembers = communities.reduce((s, c) => s + c.members, 0)
  const totalPosts = communities.reduce((s, c) => s + c.posts, 0)

  return (
    <AppShell
      title="مجتمعات الممارسة"
      description="مساحات رقمية تجمع الموظفين والخبراء حول موضوعات محددة لتبادل المعرفة الضمنية وتحويل أفضل النقاشات إلى أصول معرفية معتمدة."
      breadcrumb={[{ label: "الرئيسية", href: "/" }, { label: "مجتمعات الممارسة" }]}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Stat label="مجتمعات نشطة" value={communities.filter((c) => c.active).length.toString()} />
          <Stat label="إجمالي الأعضاء" value={totalMembers.toLocaleString("ar-SA")} />
          <Stat label="إجمالي المساهمات" value={totalPosts.toLocaleString("ar-SA")} />
        </div>
        <Button><Plus className="h-4 w-4" /> إنشاء مجتمع</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {communities.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Users className="h-5 w-5" />
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  c.active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground")}>
                  <Circle className={cn("h-2 w-2", c.active ? "fill-emerald-500 text-emerald-500" : "fill-muted-foreground text-muted-foreground")} />
                  {c.active ? "نشط" : "غير نشط"}
                </span>
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">{c.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.domain}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Crown className="h-3.5 w-3.5 text-gold" /> مالك المجتمع: <span className="text-foreground">{c.owner}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{c.members} عضو</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />{c.posts} مساهمة</span>
                <Button variant="outline" size="sm">انضمام</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-2.5">
      <p className="font-heading text-lg font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
