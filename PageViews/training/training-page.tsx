"use client"

import {
  GraduationCap, Clock, BookOpen, Users2, PlayCircle, FileText, Award, Download,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { trainingLevelKey } from "@/i18n/enum-maps"
import { DemoDataGate } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"

const levelStyleByKey: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-sky-50 text-sky-700 border-sky-200",
  advanced: "bg-amber-50 text-amber-700 border-amber-200",
}

const manualKeys = ["general", "reviewer", "admin"] as const

export function TrainingPage() {
  const t = useT()
  const { trainingPrograms } = useLocalizedData()

  return (
    <AppShell
      title={t("pages.training.title")}
      description={t("pages.training.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.training.title") }]}
    >
      <DemoDataGate>
      <h2 className="mb-4 font-heading text-base font-bold text-foreground">{t("pages.training.programs")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {trainingPrograms.map((p) => {
          const levelKey = trainingLevelKey[p.level] ?? "beginner"
          return (
            <Card key={p.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <Badge variant="outline" className={cn("text-[11px]", levelStyleByKey[levelKey])}>
                    {t(`pages.training.levels.${levelKey}`)}
                  </Badge>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users2 className="h-3.5 w-3.5" /> {p.audience}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{p.duration}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{p.lessons} {t("common.lessons")}</span>
                  <span className="flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5" />{p.format}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" className="flex-1"><PlayCircle className="h-4 w-4" /> {t("common.startProgram")}</Button>
                  <Button size="sm" variant="outline"><Award className="h-4 w-4" /> {t("common.certificate")}</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h2 className="mb-4 mt-10 font-heading text-base font-bold text-foreground">{t("pages.training.manuals")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {/* STATIC_DEMO_DATA: training manual cards from i18n keys
        {manualKeys.map((key) => (
          <div key={key} className="flex flex-col rounded-lg border border-border bg-card p-5">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <FileText className="h-5 w-5" />
            </span>
            <h3 className="font-heading text-sm font-semibold text-foreground">{t(`pages.training.manualItems.${key}.title`)}</h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{t(`pages.training.manualItems.${key}.desc`)}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full"><Download className="h-4 w-4" /> {t("common.downloadGuide")}</Button>
          </div>
        ))}
        */}
      </div>
      </DemoDataGate>
    </AppShell>
  )
}
