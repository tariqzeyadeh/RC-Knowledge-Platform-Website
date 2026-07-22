"use client"

import { useEffect, useMemo, useState } from "react"
import { Pencil, Plus, Search, Trash2, UserCog, Users } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import { summarizeUsersByRole } from "@/services/admin/user-management.service"
import { DemoDataGate } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
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
import type { PlatformUser, PlatformUserStatus } from "@/types/platform-user"
import { cn } from "@/utils"

const ROLES: UserRole[] = ["seeker", "contributor", "reviewer", "admin", "superAdmin"]
const STATUSES: PlatformUserStatus[] = ["active", "inactive"]

export function UsersPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null)
  const [editForm, setEditForm] = useState<PlatformUser | null>(null)
  const [deletingUser, setDeletingUser] = useState<PlatformUser | null>(null)

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("users_failed")
        return response.json() as Promise<{ users: PlatformUser[] }>
      })
      .then((payload) => setUsers(payload.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return users

    return users.filter((user) =>
      [user.displayName, user.username, user.email, user.department, t(`auth.roles.${user.role}`)]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [query, t, users])

  const roleCounts = summarizeUsersByRole(users)
  const activeCount = users.filter((user) => user.status === "active").length

  function openEdit(user: PlatformUser) {
    setEditingUser(user)
    setEditForm({ ...user })
  }

  function closeEdit() {
    setEditingUser(null)
    setEditForm(null)
  }

  function saveEdit() {
    if (!editForm) return
    fetch(`/api/admin/users/${editForm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: editForm.displayName,
        role: editForm.role,
        status: editForm.status,
        email: editForm.email,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("save_failed")
        return response.json() as Promise<{ user: PlatformUser }>
      })
      .then((payload) => {
        setUsers((prev) => prev.map((user) => (user.id === payload.user.id ? payload.user : user)))
        closeEdit()
      })
      .catch(() => undefined)
  }

  function confirmDelete() {
    if (!deletingUser) return
    fetch(`/api/admin/users/${deletingUser.id}`, { method: "DELETE" })
      .then(async (response) => {
        if (!response.ok) throw new Error("delete_failed")
        setUsers((prev) => prev.filter((user) => user.id !== deletingUser.id))
        setDeletingUser(null)
      })
      .catch(() => undefined)
  }

  function updateForm<K extends keyof PlatformUser>(key: K, value: PlatformUser[K]) {
    setEditForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <AppShell
      title={t("pages.users.title")}
      description={t("pages.users.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.users.title") }]}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DemoDataGate>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.users.totalUsers")}</p>
              <p className="font-heading text-xl font-bold text-foreground">{formatNumber(users.length)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <UserCog className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.users.activeUsers")}</p>
              <p className="font-heading text-xl font-bold text-foreground">{formatNumber(activeCount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="flex flex-wrap gap-2 p-4">
            {(Object.keys(roleCounts) as Array<keyof typeof roleCounts>).map((role) => (
              <Badge key={role} variant="secondary" className="text-xs font-normal">
                {t(`auth.roles.${role}`)}: {formatNumber(roleCounts[role])}
              </Badge>
            ))}
          </CardContent>
        </Card>
        </DemoDataGate>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("pages.users.searchPlaceholder")}
            className="pe-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          {t("pages.users.addUser")}
        </Button>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {formatNumber(filtered.length)} {t("pages.users.results")}
      </p>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <DemoDataGate>
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.users.columns.id")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.users.columns.name")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.users.columns.username")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.users.columns.role")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.users.columns.department")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.users.columns.email")}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.users.columns.status")}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.users.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{user.displayName}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.username}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="font-normal">
                    {t(`auth.roles.${user.role}`)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                      user.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {t(`pages.users.status.${user.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(user)}
                      aria-label={t("pages.users.editUser")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingUser(user)}
                      aria-label={t("pages.users.deleteUser")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </DemoDataGate>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("pages.users.editUser")}</DialogTitle>
            <DialogDescription>{t("pages.users.editUserDesc")}</DialogDescription>
          </DialogHeader>

          {editForm && (
            <div className="grid gap-4 py-1">
              <div className="space-y-2">
                <Label htmlFor="user-id">{t("pages.users.columns.id")}</Label>
                <Input id="user-id" value={editForm.id} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-name">{t("pages.users.columns.name")}</Label>
                <Input
                  id="user-name"
                  value={editForm.displayName}
                  onChange={(e) => updateForm("displayName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-username">{t("pages.users.columns.username")}</Label>
                <Input
                  id="user-username"
                  value={editForm.username}
                  onChange={(e) => updateForm("username", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("pages.users.columns.role")}</Label>
                  <Select value={editForm.role} onValueChange={(v) => updateForm("role", (v ?? editForm.role) as UserRole)}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{t(`auth.roles.${editForm.role}`)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {t(`auth.roles.${role}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("pages.users.columns.status")}</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(v) => updateForm("status", (v ?? editForm.status) as PlatformUserStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{t(`pages.users.status.${editForm.status}`)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`pages.users.status.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-department">{t("pages.users.columns.department")}</Label>
                <Input
                  id="user-department"
                  value={editForm.department}
                  onChange={(e) => updateForm("department", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">{t("pages.users.columns.email")}</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={closeEdit}>
              {t("common.cancel")}
            </Button>
            <Button onClick={saveEdit} disabled={!editForm?.displayName || !editForm?.username}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("pages.users.deleteUser")}</DialogTitle>
            <DialogDescription>{t("pages.users.deleteUserDesc")}</DialogDescription>
          </DialogHeader>
          {deletingUser && (
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
              {deletingUser.displayName} ({deletingUser.username})
            </p>
          )}
          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("pages.users.deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
