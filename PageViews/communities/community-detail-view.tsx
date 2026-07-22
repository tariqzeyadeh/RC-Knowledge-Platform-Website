"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Users, MessageSquare, Crown, Circle, Target, BookOpen, FileText,
  Calendar, User2, ArrowLeft, Plus, Sparkles,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils"
import type { Community } from "@/types/domain"

export function CommunityDetailView({ id }: { id: string }) {
  const t = useT()
  const { formatNumber, dir } = useLocale()
  const { getCommunity, getAsset, refresh } = useLocalizedData()
  const [community, setCommunity] = useState<Community | null>(getCommunity(id) as Community | null)
  const [loading, setLoading] = useState(!community)
  const [joining, setJoining] = useState(false)
  const [posting, setPosting] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questionTitle, setQuestionTitle] = useState("")

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/communities/${encodeURIComponent(id)}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("not_found")
        return response.json() as Promise<{ community: Community }>
      })
      .then((payload) => {
        if (!cancelled) setCommunity(payload.community)
      })
      .catch(() => {
        if (!cancelled) setCommunity(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const linkedAssets = useMemo(
    () => (community?.linkedAssetIds ?? []).map((assetId) => getAsset(assetId)).filter(Boolean),
    [community, getAsset],
  )

  async function handleJoin() {
    if (!community) return
    setJoining(true)
    try {
      const response = await fetch(`/api/communities/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "join" }),
      })
      if (!response.ok) return
      const payload = (await response.json()) as { community: Community }
      setCommunity(payload.community)
      await refresh()
    } finally {
      setJoining(false)
    }
  }

  async function handleAskQuestion() {
    if (!community || !questionTitle.trim()) return
    setPosting(true)
    try {
      const response = await fetch(`/api/communities/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "post", title: questionTitle.trim() }),
      })
      if (!response.ok) return
      const payload = (await response.json()) as { community: Community }
      setCommunity(payload.community)
      setQuestionTitle("")
      setShowQuestionForm(false)
      await refresh()
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return (
      <AppShell breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.communities.title"), href: "/communities" }, { label: id }]}>
        <div className="rounded-lg border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      </AppShell>
    )
  }

  if (!community) {
    return (
      <AppShell breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.communities.title"), href: "/communities" }, { label: id }]}>
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          {t("common.noResults")}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.communities.title"), href: "/communities" },
        { label: community.name },
      ]}
    >
      <div className="mb-6">
        <Link href="/communities" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className={cn("h-3.5 w-3.5", dir === "ltr" && "rotate-180")} /> {t("common.backToCommunities")}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Users className="h-7 w-7" />
            </span>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{community.domain}</Badge>
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  community.active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground",
                )}>
                  <Circle className={cn("h-2 w-2", community.active ? "fill-emerald-500 text-emerald-500" : "fill-muted-foreground text-muted-foreground")} />
                  {community.active ? t("pages.communities.active") : t("pages.communities.inactive")}
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{community.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{community.desc}</p>
            </div>
          </div>
          {community.active && (
            <Button onClick={handleJoin} disabled={joining}>
              <Plus className="h-4 w-4" /> {t("common.joinCommunity")}
            </Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Crown className="h-3.5 w-3.5 text-gold" />{community.owner}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{formatNumber(community.members)} {t("common.members")}</span>
          <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />{formatNumber(community.posts)} {t("common.posts")}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{t("common.createdAt")} {community.createdAt}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <Target className="h-4 w-4" /> {t("pages.communities.detail.objectives")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                {community.objectives.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {o}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <BookOpen className="h-4 w-4" /> {t("pages.communities.detail.charter")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{community.charter}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <MessageSquare className="h-4 w-4" /> {t("pages.communities.detail.recentDiscussions")}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowQuestionForm((value) => !value)}>
                {t("common.askQuestion")}
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {showQuestionForm && (
                <div className="mb-4 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                  <div>
                    <Label htmlFor="question-title">{t("pages.communities.detail.questionTitle")}</Label>
                    <Input
                      id="question-title"
                      className="mt-1.5"
                      value={questionTitle}
                      onChange={(e) => setQuestionTitle(e.target.value)}
                      placeholder={t("pages.communities.detail.questionPlaceholder")}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAskQuestion} disabled={posting || !questionTitle.trim()}>
                      {t("common.submit")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowQuestionForm(false)}>
                      {t("common.cancel")}
                    </Button>
                  </div>
                </div>
              )}
              {community.recentPosts.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{t("common.noResults")}</p>
              ) : (
                community.recentPosts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><User2 className="h-3 w-3" />{post.author}</span>
                      <span>{post.date}</span>
                      <span>{post.replies} {t("common.replies")}</span>
                      {post.convertedToAsset && (
                        <Link href={`/knowledge/${post.convertedToAsset}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Sparkles className="h-3 w-3" /> {t("common.convertedToAsset")}
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.communities.detail.communityData")}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Meta label={t("pages.communities.detail.id")} value={community.id} mono />
              <Meta label={t("pages.communities.detail.domain")} value={community.domain} />
              <Meta label={t("pages.communities.owner")} value={community.owner} />
              <Meta label={t("pages.communities.detail.createdAt")} value={community.createdAt} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.communities.detail.moderators")}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {community.moderators.map((m) => (
                <Badge key={m} variant="secondary" className="font-normal">{m}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-heading text-base">{t("pages.communities.detail.topics")}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {community.topics.map((topic) => (
                <Badge key={topic} variant="outline" className="font-normal">{topic}</Badge>
              ))}
            </CardContent>
          </Card>

          {linkedAssets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <FileText className="h-4 w-4" /> {t("pages.communities.detail.linkedAssets")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {linkedAssets.map((asset) => asset && (
                  <Link key={asset.id} href={`/knowledge/${asset.id}`} className="block rounded-md border border-border p-3 transition-colors hover:border-primary/40">
                    <p className="text-[11px] text-muted-foreground">{asset.type}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs font-medium text-foreground">{asset.title}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </AppShell>
  )
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-end text-foreground", mono && "font-mono")}>{value}</span>
    </div>
  )
}
