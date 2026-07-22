"use client"

import { useState } from "react"
import { ChevronDown, Target, Lightbulb, ShieldCheck, BadgeCheck } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils"

export function FeaturesPage() {
  const t = useT()
  const { features, seciLayers } = useLocalizedData()
  const [layer, setLayer] = useState<string>("all")
  const [open, setOpen] = useState<string | null>("F-01")

  const filtered = layer === "all" ? features : features.filter((f) => f.layer === layer)

  return (
    <AppShell
      title={t("pages.features.title")}
      description={t("pages.features.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.features.title") }]}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip label={t("pages.features.allFeatures")} count={features.length} active={layer === "all"} onClick={() => setLayer("all")} />
        {seciLayers.map((l) => (
          <FilterChip key={l.id} label={l.title} count={features.filter((f) => f.layer === l.id).length}
            active={layer === l.id} onClick={() => setLayer(l.id)} color={l.color} />
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            {t("common.noResults")}
          </div>
        ) : filtered.map((f) => {
          const isOpen = open === f.code
          const seciLayer = seciLayers.find((l) => l.id === f.layer)
          return (
            <div key={f.code} className="overflow-hidden rounded-lg border border-border bg-card">
              <button
                onClick={() => setOpen(isOpen ? null : f.code)}
                className="flex w-full items-center gap-4 p-4 text-start transition-colors hover:bg-muted/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-primary-foreground"
                  style={{ background: seciLayer?.color }}>
                  {f.code.replace("F-", "")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{f.code}</span>
                    <span className="text-[11px] text-muted-foreground">· {f.seciStage}</span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">{f.name}</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{f.nameEn}</p>
                </div>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="border-t border-border px-4 pb-5 pt-4 sm:px-[72px]">
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <InfoBlock icon={<Target className="h-4 w-4" />} title={t("pages.features.impact")}>{f.impact}</InfoBlock>
                    <InfoBlock icon={<Lightbulb className="h-4 w-4" />} title={t("pages.features.example")}>{f.example}</InfoBlock>
                  </div>

                  <div className="mt-4">
                    <p className="mb-1.5 text-xs font-medium text-foreground">{t("pages.features.roles")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {f.roles.map((r) => <Badge key={r} variant="secondary" className="font-normal">{r}</Badge>)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Standard icon={<ShieldCheck className="h-3.5 w-3.5" />} label={t("pages.features.standards.iso")} value={f.iso} />
                    <Standard icon={<BadgeCheck className="h-3.5 w-3.5" />} label={t("pages.features.standards.efqm")} value={f.efqm} />
                    <Standard icon={<BadgeCheck className="h-3.5 w-3.5" />} label={t("pages.features.standards.national")} value={f.national} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}

function FilterChip({ label, count, active, onClick, color }: { label: string; count: number; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick}
      className={cn("flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40")}>
      {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />}
      {label}
      <span className={cn("rounded-full px-1.5 text-[10px]", active ? "bg-white/20" : "bg-muted")}>{count}</span>
    </button>
  )
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-foreground">{icon}{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

function Standard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-2.5">
      <p className="mb-0.5 flex items-center gap-1 text-[11px] font-medium text-primary">{icon}{label}</p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{value}</p>
    </div>
  )
}
