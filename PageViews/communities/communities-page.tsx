"use client"

import Link from "next/link"
import { Users, MessageSquare, Crown, Plus, Circle } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { ButtonLink } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/utils"

export function CommunitiesPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const { communities } = useLocalizedData()
  const totalMembers = communities.reduce((s, c) => s + c.members, 0)
  const totalPosts = communities.reduce((s, c) => s + c.posts, 0)

  return (
    <AppShell
      title={t("pages.communities.title")}
      description={t("pages.communities.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.communities.title") }]}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Stat label={t("pages.communities.activeCommunities")} value={formatNumber(communities.filter((c) => c.active).length)} />
          <Stat label={t("pages.communities.totalMembers")} value={formatNumber(totalMembers)} />
          <Stat label={t("pages.communities.totalPosts")} value={formatNumber(totalPosts)} />
        </div>
        <ButtonLink href="/communities/create"><Plus className="h-4 w-4" /> {t("pages.communities.create")}</ButtonLink>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {communities.map((c) => (
          <Card key={c.id} className="flex flex-col transition-colors hover:border-primary/40">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Users className="h-5 w-5" />
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  c.active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground")}>
                  <Circle className={cn("h-2 w-2", c.active ? "fill-emerald-500 text-emerald-500" : "fill-muted-foreground text-muted-foreground")} />
                  {c.active ? t("pages.communities.active") : t("pages.communities.inactive")}
                </span>
              </div>
              <Link href={`/communities/${c.id}`} className="font-heading text-base font-bold text-foreground hover:text-primary">
                {c.name}
              </Link>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.domain}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Crown className="h-3.5 w-3.5 text-gold" /> {t("pages.communities.owner")}: <span className="text-foreground">{c.owner}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{formatNumber(c.members)} {t("common.members")}</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />{formatNumber(c.posts)} {t("common.posts")}</span>
                <ButtonLink href={`/communities/${c.id}`} variant="outline" size="sm">{t("common.details")}</ButtonLink>
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
