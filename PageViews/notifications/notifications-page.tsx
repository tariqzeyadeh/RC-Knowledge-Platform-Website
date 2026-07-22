"use client"

import { useState } from "react"
import {
  Bell, ClipboardCheck, CheckCircle2, XCircle, FileText, AlarmClock, Lock, CheckCheck,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useT } from "@/hooks/use-locale"
import { useLocalizedData } from "@/hooks/use-localized-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils"

const typeMap: Record<string, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  review: { icon: ClipboardCheck, cls: "bg-amber-50 text-amber-700" },
  approved: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700" },
  rejected: { icon: XCircle, cls: "bg-red-50 text-red-700" },
  new: { icon: FileText, cls: "bg-sky-50 text-sky-700" },
  expiry: { icon: AlarmClock, cls: "bg-amber-50 text-amber-700" },
  access: { icon: Lock, cls: "bg-muted text-muted-foreground" },
}

export function NotificationsPage() {
  const t = useT()
  const { notifications, refresh } = useLocalizedData()
  const [marking, setMarking] = useState(false)
  const unread = notifications.filter((n) => n.unread).length

  async function handleMarkAllRead() {
    setMarking(true)
    try {
      const response = await fetch("/api/notifications", { method: "PATCH" })
      if (!response.ok) return
      await refresh()
    } finally {
      setMarking(false)
    }
  }

  return (
    <AppShell
      title={t("pages.notifications.title")}
      description={t("pages.notifications.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.notifications.title") }]}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" /> {t("common.youHave")} <span className="font-bold text-foreground">{unread}</span> {t("common.unreadNotifications")}
          </p>
          <Button variant="outline" size="sm" disabled={marking || unread === 0} onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4" /> {t("common.markAllRead")}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {notifications.map((n) => {
            const typeInfo = typeMap[n.type]
            const Icon = typeInfo.icon
            return (
              <div key={n.id} className={cn("flex items-start gap-3 border-b border-border p-4 last:border-0 transition-colors hover:bg-muted/40",
                n.unread && "bg-secondary/30")}>
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", typeInfo.cls)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    {n.unread && <span className="h-2 w-2 rounded-full bg-gold" aria-label={t("common.unread")} />}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.desc}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground/70">{n.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
