"use client"

import { ScrollText, CheckCircle2, XCircle, Download, Search } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { auditResultKey } from "@/i18n/enum-maps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils"

export function AuditPage() {
  const t = useT()
  const { auditLog } = useLocalizedData()

  return (
    <AppShell
      title={t("pages.audit.title")}
      description={t("pages.audit.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.audit.title") }]}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("pages.audit.searchPlaceholder")} className="pe-9" />
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4" /> {t("common.exportLog")}</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.audit.columns.id")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.audit.columns.user")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.audit.columns.action")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.audit.columns.target")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.audit.columns.time")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.audit.columns.ip")}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.audit.columns.result")}</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((a) => {
              const resultKey = auditResultKey[a.result] ?? "success"
              const isSuccess = resultKey === "success"
              return (
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
                      isSuccess ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
                      {isSuccess ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {t(`enums.auditResult.${resultKey}`)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {t("pages.governance.siemNote")}
      </p>
    </AppShell>
  )
}
