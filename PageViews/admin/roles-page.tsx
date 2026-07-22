"use client"

import { ShieldCheck, Check, Minus, Users, Plus } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { DemoDataGate } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/utils"

const permKeys = ["create", "review", "approve", "publish", "admin"] as const

export function RolesPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const { roles } = useLocalizedData()

  return (
    <AppShell
      title={t("pages.roles.title")}
      description={t("pages.roles.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.roles.title") }]}
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{roles.length} {t("common.rolesDefined")}</p>
        <Button><Plus className="h-4 w-4" /> {t("common.addRole")}</Button>
      </div>

      <DemoDataGate>
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />{formatNumber(r.users)}
                </span>
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground">{r.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {permKeys.filter((p) => r.permissions[p]).map((p) => (
                  <span key={p} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{t(`common.perms.${p}`)}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 font-heading text-base font-bold text-foreground">{t("common.permissionMatrix")}</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("common.role")}</th>
              {permKeys.map((p) => (
                <th key={p} className="px-4 py-3 text-center font-medium text-muted-foreground">{t(`common.perms.${p}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                {permKeys.map((p) => (
                  <td key={p} className="px-4 py-3 text-center">
                    {r.permissions[p] ? (
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
      </DemoDataGate>
    </AppShell>
  )
}
