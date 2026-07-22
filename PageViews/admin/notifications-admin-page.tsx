"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  BellRing,
  CalendarClock,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import {
  filterByKind,
  filterByStatus,
  summarizeBroadcasts,
} from "@/services/admin/broadcast-management.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserRole } from "@/types/auth"
import type {
  BroadcastAudience,
  BroadcastKind,
  BroadcastMessage,
  BroadcastPriority,
  BroadcastStatus,
  SystemNotificationType,
} from "@/types/broadcast"
import { cn } from "@/utils"

const KINDS: BroadcastKind[] = ["announcement", "notification"]
const STATUSES: BroadcastStatus[] = ["draft", "scheduled", "published", "archived"]
const PRIORITIES: BroadcastPriority[] = ["normal", "high", "urgent"]
const AUDIENCES: BroadcastAudience[] = ["all", "seeker", "contributor", "reviewer", "admin"]
const NOTIFICATION_TYPES: SystemNotificationType[] = [
  "review",
  "approved",
  "rejected",
  "new",
  "expiry",
  "access",
]

type KindFilter = "all" | BroadcastKind
type StatusFilter = "all" | BroadcastStatus
type FormMode = "create" | "edit"

function emptyMessage(): BroadcastMessage {
  const id = `BC-${String(Date.now()).slice(-6)}`
  return {
    id,
    kind: "announcement",
    title: "",
    body: "",
    audience: "all",
    priority: "normal",
    status: "draft",
    createdBy: "مشرف المنصة",
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

const priorityStyles: Record<BroadcastPriority, string> = {
  normal: "bg-muted text-muted-foreground",
  high: "bg-amber-50 text-amber-800",
  urgent: "bg-red-50 text-red-700",
}

const statusStyles: Record<BroadcastStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-sky-50 text-sky-800",
  published: "bg-emerald-50 text-emerald-700",
  archived: "bg-muted/60 text-muted-foreground",
}

export function NotificationsAdminPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const [messages, setMessages] = useState<BroadcastMessage[]>([])
  const [query, setQuery] = useState("")
  const [kindFilter, setKindFilter] = useState<KindFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [formMode, setFormMode] = useState<FormMode>("create")
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<BroadcastMessage | null>(null)
  const [deleting, setDeleting] = useState<BroadcastMessage | null>(null)

  useEffect(() => {
    fetch("/api/admin/broadcasts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("broadcasts_failed")
        return response.json() as Promise<{ messages: BroadcastMessage[] }>
      })
      .then((payload) => setMessages(payload.messages))
      .catch(() => setMessages([]))
  }, [])

  const stats = summarizeBroadcasts(messages)

  const filtered = useMemo(() => {
    let list = filterByKind(messages, kindFilter)
    list = filterByStatus(list, statusFilter)

    const normalized = query.trim().toLowerCase()
    if (!normalized) return list

    return list.filter((item) =>
      [item.id, item.title, item.body, t(`pages.notificationsAdmin.audience.${item.audience}`)]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [kindFilter, messages, query, statusFilter, t])

  function openCreate() {
    setFormMode("create")
    setForm(emptyMessage())
    setFormOpen(true)
  }

  function openEdit(item: BroadcastMessage) {
    setFormMode("edit")
    setForm({ ...item })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setForm(null)
  }

  function updateForm<K extends keyof BroadcastMessage>(key: K, value: BroadcastMessage[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function saveForm() {
    if (!form?.title.trim() || !form.body.trim()) return

    const saved: BroadcastMessage = {
      ...form,
      title: form.title.trim(),
      body: form.body.trim(),
      notificationType:
        form.kind === "notification" ? form.notificationType ?? "new" : undefined,
      publishedAt:
        form.status === "published" && !form.publishedAt
          ? new Date().toISOString().slice(0, 10)
          : form.publishedAt,
    }

    const request =
      formMode === "create"
        ? fetch("/api/admin/broadcasts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saved),
          })
        : fetch(`/api/admin/broadcasts/${saved.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saved),
          })

    request
      .then(async (response) => {
        if (!response.ok) throw new Error("save_failed")
        if (formMode === "create") {
          setMessages((prev) => [saved, ...prev])
        } else {
          setMessages((prev) => prev.map((item) => (item.id === saved.id ? saved : item)))
        }
        closeForm()
      })
      .catch(() => undefined)
  }

  function confirmDelete() {
    if (!deleting) return
    fetch(`/api/admin/broadcasts/${deleting.id}`, { method: "DELETE" })
      .then(async (response) => {
        if (!response.ok) throw new Error("delete_failed")
        setMessages((prev) => prev.filter((item) => item.id !== deleting.id))
        setDeleting(null)
      })
      .catch(() => undefined)
  }

  return (
    <AppShell
      title={t("pages.notificationsAdmin.title")}
      description={t("pages.notificationsAdmin.description")}
      breadcrumb={[
        { label: t("common.home"), href: "/" },
        { label: t("pages.notificationsAdmin.title") },
      ]}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.notificationsAdmin.total")}</p>
              <p className="font-heading text-xl font-bold text-foreground">{formatNumber(stats.total)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.notificationsAdmin.announcements")}</p>
              <p className="font-heading text-xl font-bold text-foreground">
                {formatNumber(stats.announcements)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.notificationsAdmin.notifications")}</p>
              <p className="font-heading text-xl font-bold text-foreground">
                {formatNumber(stats.notifications)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.notificationsAdmin.scheduled")}</p>
              <p className="font-heading text-xl font-bold text-foreground">
                {formatNumber(stats.scheduled)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("pages.notificationsAdmin.searchPlaceholder")}
              className="pe-9"
            />
          </div>
          <Select value={kindFilter} onValueChange={(v) => setKindFilter((v ?? "all") as KindFilter)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue>{t(`pages.notificationsAdmin.kindFilter.${kindFilter}`)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("pages.notificationsAdmin.kindFilter.all")}</SelectItem>
              {KINDS.map((kind) => (
                <SelectItem key={kind} value={kind}>
                  {t(`pages.notificationsAdmin.kinds.${kind}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter((v ?? "all") as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue>{t(`pages.notificationsAdmin.statusFilter.${statusFilter}`)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("pages.notificationsAdmin.statusFilter.all")}</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`pages.notificationsAdmin.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {t("pages.notificationsAdmin.create")}
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {formatNumber(filtered.length)} {t("pages.notificationsAdmin.results")}
        </p>
        <Badge variant="secondary" className="font-normal">
          {t("pages.notificationsAdmin.featureRef")}
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start">
              <th className="px-4 py-3 font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.kind")}
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.audience")}
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.priority")}
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.date")}
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                {t("pages.notificationsAdmin.columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Badge variant="outline" className="gap-1 font-normal">
                    {item.kind === "announcement" ? (
                      <Megaphone className="h-3 w-3" />
                    ) : (
                      <Bell className="h-3 w-3" />
                    )}
                    {t(`pages.notificationsAdmin.kinds.${item.kind}`)}
                  </Badge>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.body}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="font-normal">
                    {t(`pages.notificationsAdmin.audience.${item.audience}`)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                      priorityStyles[item.priority],
                    )}
                  >
                    {t(`pages.notificationsAdmin.priority.${item.priority}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                      statusStyles[item.status],
                    )}
                  >
                    {t(`pages.notificationsAdmin.status.${item.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {item.publishedAt ?? item.scheduledAt ?? item.createdAt}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(item)}
                      aria-label={t("pages.notificationsAdmin.edit")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(item)}
                      aria-label={t("pages.notificationsAdmin.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? t("pages.notificationsAdmin.createTitle")
                : t("pages.notificationsAdmin.editTitle")}
            </DialogTitle>
            <DialogDescription>{t("pages.notificationsAdmin.formDesc")}</DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-1">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("pages.notificationsAdmin.columns.kind")}</Label>
                  <Select
                    value={form.kind}
                    onValueChange={(v) => updateForm("kind", (v ?? form.kind) as BroadcastKind)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{t(`pages.notificationsAdmin.kinds.${form.kind}`)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {KINDS.map((kind) => (
                        <SelectItem key={kind} value={kind}>
                          {t(`pages.notificationsAdmin.kinds.${kind}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("pages.notificationsAdmin.columns.status")}</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => updateForm("status", (v ?? form.status) as BroadcastStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{t(`pages.notificationsAdmin.status.${form.status}`)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`pages.notificationsAdmin.status.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="broadcast-title">{t("pages.notificationsAdmin.columns.title")}</Label>
                <Input
                  id="broadcast-title"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="broadcast-body">{t("pages.notificationsAdmin.columns.body")}</Label>
                <Textarea
                  id="broadcast-body"
                  rows={4}
                  value={form.body}
                  onChange={(e) => updateForm("body", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("pages.notificationsAdmin.columns.audience")}</Label>
                  <Select
                    value={form.audience}
                    onValueChange={(v) =>
                      updateForm("audience", (v ?? form.audience) as BroadcastAudience)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {t(`pages.notificationsAdmin.audience.${form.audience}`)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {t(`pages.notificationsAdmin.audience.${audience}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("pages.notificationsAdmin.columns.priority")}</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) =>
                      updateForm("priority", (v ?? form.priority) as BroadcastPriority)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{t(`pages.notificationsAdmin.priority.${form.priority}`)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {t(`pages.notificationsAdmin.priority.${priority}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {form.kind === "notification" && (
                <div className="space-y-2">
                  <Label>{t("pages.notificationsAdmin.notificationType")}</Label>
                  <Select
                    value={form.notificationType ?? "new"}
                    onValueChange={(v) =>
                      updateForm(
                        "notificationType",
                        (v ?? form.notificationType ?? "new") as SystemNotificationType,
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {t(
                          `pages.notificationsAdmin.notificationTypes.${form.notificationType ?? "new"}`,
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`pages.notificationsAdmin.notificationTypes.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {form.status === "scheduled" && (
                <div className="space-y-2">
                  <Label htmlFor="broadcast-scheduled">{t("pages.notificationsAdmin.scheduledAt")}</Label>
                  <Input
                    id="broadcast-scheduled"
                    type="date"
                    value={form.scheduledAt ?? ""}
                    onChange={(e) => updateForm("scheduledAt", e.target.value || undefined)}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={closeForm}>
              {t("common.cancel")}
            </Button>
            <Button onClick={saveForm} disabled={!form?.title.trim() || !form?.body.trim()}>
              {form?.status === "published" ? (
                <>
                  <Send className="h-4 w-4" />
                  {t("pages.notificationsAdmin.publish")}
                </>
              ) : (
                t("common.save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("pages.notificationsAdmin.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("pages.notificationsAdmin.deleteDesc")}</DialogDescription>
          </DialogHeader>
          {deleting && (
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
              {deleting.title}
            </p>
          )}
          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
