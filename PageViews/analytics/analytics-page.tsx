"use client"

import {
  Library, Search, Users, ClipboardCheck, TrendingUp, TrendingDown, Download, FileBarChart,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import {
  ActivityAreaChart, SearchLineChart, DepartmentBarChart, HealthPieChart,
  TopContributorsChart, TopCommunitiesChart,
} from "@/components/charts"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Library, Search, Users, ClipboardCheck,
}

export function AnalyticsPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const {
    kpis, monthlyActivity, departmentContribution, contentHealth,
    topSearches, topContributors, topCommunities,
  } = useLocalizedData()

  return (
    <AppShell
      title={t("pages.analytics.title")}
      description={t("pages.analytics.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.analytics.title") }]}
    >
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm"><FileBarChart className="h-4 w-4" /> {t("pages.analytics.monthlyReport")}</Button>
        <Button size="sm"><Download className="h-4 w-4" /> {t("common.export")}</Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = kpiIcons[k.icon] ?? Library
          return (
            <Card key={k.icon}>
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
                <p className="mt-1 text-xs text-muted-foreground">{t(`kpi.${k.icon}`)}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">{t("pages.analytics.publishActivity")}</CardTitle></CardHeader>
          <CardContent><ActivityAreaChart data={monthlyActivity} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">{t("pages.analytics.monthlySearches")}</CardTitle></CardHeader>
          <CardContent><SearchLineChart data={monthlyActivity} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">{t("pages.analytics.deptContribution")}</CardTitle></CardHeader>
          <CardContent><DepartmentBarChart data={departmentContribution} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="font-heading text-base">{t("pages.analytics.contentHealth")}</CardTitle></CardHeader>
          <CardContent><HealthPieChart data={contentHealth} /></CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-heading text-base">{t("pages.analytics.topSearches")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="space-y-4">
              {topSearches.map((item) => (
                <div key={item.term}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.term}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(item.count)} {t("pages.analytics.searches")} · {t("pages.analytics.searchSuccess")} {item.success}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.success >= 85 ? "bg-primary" : "bg-gold"}`}
                      style={{ width: `${item.success}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-heading text-base">{t("pages.analytics.topContributors")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <TopContributorsChart data={topContributors} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-heading text-base">{t("pages.analytics.topCommunities")}</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <TopCommunitiesChart data={topCommunities} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
