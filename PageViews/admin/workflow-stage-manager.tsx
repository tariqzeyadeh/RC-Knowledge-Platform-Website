"use client"

import { useMemo, useState } from "react"
import {
  BadgeCheck,
  Bell,
  ClipboardCheck,
  Eye,
  FileEdit,
  Globe,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { useLocale, useT } from "@/hooks/use-locale"
import { countWorkflowsUsingStage, summarizeStages } from "@/services/admin/workflow.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import type { WorkflowDefinition, WorkflowStage } from "@/types/workflow"
import {
  isBuiltinStageId,
  REQUIRED_STAGE_IDS,
  WORKFLOW_ACTION_OPTIONS,
} from "@/types/workflow"
import { cn } from "@/utils"

const STAGE_ROLES: UserRole[] = ["contributor", "reviewer", "admin"]

const stageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  draft: FileEdit,
  review: ClipboardCheck,
  approval: BadgeCheck,
  publish: Globe,
}

const stageColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  review: "bg-amber-50 text-amber-800 border-amber-200",
  approval: "bg-sky-50 text-sky-800 border-sky-200",
  publish: "bg-emerald-50 text-emerald-800 border-emerald-200",
}

const defaultStageStyle = "bg-violet-50 text-violet-800 border-violet-200"

type FormMode = "create" | "edit"

function slugifyId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

function emptyStage(order: number): WorkflowStage {
  return {
    id: "",
    label: "",
    order,
    role: "reviewer",
    slaHours: 24,
    notifyOnEnter: true,
    autoEscalate: false,
    actions: ["comment"],
    system: false,
  }
}

export function getStageLabel(stage: WorkflowStage, t: (key: string) => string) {
  if (isBuiltinStageId(stage.id)) return t(`enums.reviewStage.${stage.id}`)
  return stage.label || stage.id
}

function getStageIcon(id: string) {
  return stageIcons[id] ?? ClipboardCheck
}

function getStageColor(id: string) {
  return stageColors[id] ?? defaultStageStyle
}

type WorkflowStageManagerProps = {
  stages: WorkflowStage[]
  workflows: WorkflowDefinition[]
  onChange: (stages: WorkflowStage[]) => void
}

export function WorkflowStageManager({ stages, workflows, onChange }: WorkflowStageManagerProps) {
  const t = useT()
  const { formatNumber } = useLocale()
  const [query, setQuery] = useState("")
  const [viewing, setViewing] = useState<WorkflowStage | null>(null)
  const [formMode, setFormMode] = useState<FormMode>("create")
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<WorkflowStage | null>(null)
  const [deleting, setDeleting] = useState<WorkflowStage | null>(null)

  const stats = summarizeStages(stages)

  const sortedStages = useMemo(
    () => [...stages].sort((a, b) => a.order - b.order),
    [stages],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return sortedStages
    return sortedStages.filter((stage) =>
      [stage.id, stage.label, getStageLabel(stage, t), t(`auth.roles.${stage.role}`)]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [query, sortedStages, t])

  function openCreate() {
    const maxOrder = stages.reduce((max, stage) => Math.max(max, stage.order), 0)
    setFormMode("create")
    setForm(emptyStage(maxOrder + 1))
    setFormOpen(true)
  }

  function openEdit(stage: WorkflowStage) {
    setFormMode("edit")
    setForm({ ...stage, actions: [...stage.actions] })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setForm(null)
  }

  function updateForm<K extends keyof WorkflowStage>(key: K, value: WorkflowStage[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function toggleAction(action: string, checked: boolean) {
    if (!form) return
    const next = checked
      ? [...new Set([...form.actions, action])]
      : form.actions.filter((item) => item !== action)
    updateForm("actions", next)
  }

  function saveForm() {
    if (!form?.label.trim()) return

    const stageId =
      formMode === "create"
        ? form.id.trim() || slugifyId(form.label) || `ST-${Date.now().toString(36).slice(-6)}`
        : form.id

    if (!stageId) return
    if (formMode === "create" && stages.some((stage) => stage.id === stageId)) return

    const saved: WorkflowStage = {
      ...form,
      id: stageId,
      label: form.label.trim(),
      actions: form.actions.length > 0 ? form.actions : ["comment"],
    }

    const request =
      formMode === "create"
        ? fetch("/api/admin/workflow-stages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saved),
          })
        : fetch(`/api/admin/workflow-stages/${saved.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saved),
          })

    request
      .then(async (response) => {
        if (!response.ok) throw new Error("save_failed")
        if (formMode === "create") {
          onChange([...stages, saved].sort((a, b) => a.order - b.order))
        } else {
          onChange(stages.map((stage) => (stage.id === saved.id ? saved : stage)))
        }
        if (viewing?.id === saved.id) setViewing(saved)
        closeForm()
      })
      .catch(() => undefined)
  }

  function confirmDelete() {
    if (!deleting) return
    fetch(`/api/admin/workflow-stages/${deleting.id}`, { method: "DELETE" })
      .then(async (response) => {
        if (!response.ok) throw new Error("delete_failed")
        onChange(stages.filter((stage) => stage.id !== deleting.id))
        if (viewing?.id === deleting.id) setViewing(null)
        setDeleting(null)
      })
      .catch(() => undefined)
  }

  const deleteBlocked =
    deleting &&
    (deleting.system
      ? "system"
      : countWorkflowsUsingStage(workflows, deleting.id) > 0
        ? "inUse"
        : null)

  const formIdConflict =
    formMode === "create" &&
    form &&
    (form.id.trim() || slugifyId(form.label)) &&
    stages.some((stage) => stage.id === (form.id.trim() || slugifyId(form.label)))

  return (
    <section className="mb-8">
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t("pages.workflow.stageStats.total")}</p>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">{formatNumber(stats.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t("pages.workflow.stageStats.system")}</p>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">{formatNumber(stats.system)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t("pages.workflow.stageStats.custom")}</p>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">{formatNumber(stats.custom)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t("pages.workflow.stageStats.escalation")}</p>
            <p className="mt-1 font-heading text-xl font-bold text-foreground">
              {formatNumber(stats.withEscalation)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          {t("pages.workflow.stagesTitle")}
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("pages.workflow.stageSearchPlaceholder")}
              className="pe-9"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t("pages.workflow.createStage")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-start">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.stageColumns.order")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.columns.stage")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.columns.role")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.columns.sla")}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.workflow.columns.notify")}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.workflow.columns.escalate")}</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.workflow.stageColumns.tableActions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stage) => {
              const Icon = getStageIcon(stage.id)
              return (
                <tr
                  key={stage.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/30",
                    viewing?.id === stage.id && "bg-secondary/20",
                  )}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{stage.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", getStageColor(stage.id))}>
                        <Icon className="h-3 w-3" />
                        {getStageLabel(stage, t)}
                      </span>
                      {stage.system && (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {t("pages.workflow.systemStage")}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{stage.id}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{t(`auth.roles.${stage.role}`)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {stage.slaHours > 0
                      ? `${formatNumber(stage.slaHours)} ${t("pages.workflow.hours")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {stage.notifyOnEnter ? (
                      <Bell className="mx-auto h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {stage.autoEscalate ? (
                      <Badge variant="secondary" className="text-[10px]">{t("common.yes")}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">{t("common.no")}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewing(stage)}
                        aria-label={t("pages.workflow.viewStage")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(stage)}
                        aria-label={t("pages.workflow.editStage")}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(stage)}
                        aria-label={t("pages.workflow.deleteStage")}
                        disabled={stage.system}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {viewing && (
        <Card className="mt-4 border-primary/20">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                {getStageLabel(viewing, t)}
                {viewing.system && (
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {t("pages.workflow.systemStage")}
                  </Badge>
                )}
              </CardTitle>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{viewing.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(viewing)}>
                <Pencil className="h-4 w-4" />
                {t("pages.workflow.editStage")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setViewing(null)}>
                {t("common.cancel")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.stageColumns.order")}</p>
              <p className="font-medium text-foreground">{formatNumber(viewing.order)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.columns.role")}</p>
              <p className="font-medium text-foreground">{t(`auth.roles.${viewing.role}`)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.columns.sla")}</p>
              <p className="font-medium text-foreground">
                {viewing.slaHours > 0
                  ? `${formatNumber(viewing.slaHours)} ${t("pages.workflow.hours")}`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.columns.notify")}</p>
              <p className="font-medium text-foreground">
                {viewing.notifyOnEnter ? t("common.yes") : t("common.no")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.columns.escalate")}</p>
              <p className="font-medium text-foreground">
                {viewing.autoEscalate ? t("common.yes") : t("common.no")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.stageUsedIn")}</p>
              <p className="font-medium text-foreground">
                {formatNumber(countWorkflowsUsingStage(workflows, viewing.id))} {t("pages.workflow.workflowsCount")}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="mb-2 text-xs text-muted-foreground">{t("pages.workflow.columns.actions")}</p>
              <div className="flex flex-wrap gap-1">
                {viewing.actions.map((action) => (
                  <Badge key={action} variant="outline" className="text-[10px] font-normal">
                    {t(`pages.workflow.actions.${action}`)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? t("pages.workflow.createStageTitle") : t("pages.workflow.editStageTitle")}
            </DialogTitle>
            <DialogDescription>{t("pages.workflow.stageFormDesc")}</DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-1">
              {formMode === "edit" ? (
                <div className="space-y-2">
                  <Label>{t("pages.workflow.stageColumns.id")}</Label>
                  <Input value={form.id} disabled />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="stage-id">{t("pages.workflow.stageColumns.id")}</Label>
                  <Input
                    id="stage-id"
                    value={form.id}
                    placeholder={slugifyId(form.label) || "quality-check"}
                    onChange={(e) => updateForm("id", e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">{t("pages.workflow.stageIdHint")}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="stage-label">{t("pages.workflow.stageColumns.label")}</Label>
                <Input
                  id="stage-label"
                  value={form.label}
                  onChange={(e) => updateForm("label", e.target.value)}
                  disabled={form.system && isBuiltinStageId(form.id)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stage-order">{t("pages.workflow.stageColumns.order")}</Label>
                  <Input
                    id="stage-order"
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => updateForm("order", Number(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage-sla">{t("pages.workflow.columns.sla")}</Label>
                  <Input
                    id="stage-sla"
                    type="number"
                    min={0}
                    value={form.slaHours}
                    onChange={(e) => updateForm("slaHours", Math.max(0, Number(e.target.value) || 0))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("pages.workflow.columns.role")}</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => updateForm("role", (v ?? form.role) as UserRole)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>{t(`auth.roles.${form.role}`)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {t(`auth.roles.${role}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-primary"
                    checked={form.notifyOnEnter}
                    onChange={(e) => updateForm("notifyOnEnter", e.target.checked)}
                  />
                  <span className="text-sm">{t("pages.workflow.columns.notify")}</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-primary"
                    checked={form.autoEscalate}
                    onChange={(e) => updateForm("autoEscalate", e.target.checked)}
                  />
                  <span className="text-sm">{t("pages.workflow.columns.escalate")}</span>
                </label>
              </div>

              <div className="space-y-2">
                <Label>{t("pages.workflow.columns.actions")}</Label>
                <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
                  {WORKFLOW_ACTION_OPTIONS.map((action) => (
                    <label key={action} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary"
                        checked={form.actions.includes(action)}
                        onChange={(e) => toggleAction(action, e.target.checked)}
                      />
                      {t(`pages.workflow.actions.${action}`)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={closeForm}>
              {t("common.cancel")}
            </Button>
            <Button onClick={saveForm} disabled={!form?.label.trim() || !!formIdConflict}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("pages.workflow.deleteStageTitle")}</DialogTitle>
            <DialogDescription>
              {deleteBlocked === "system"
                ? t("pages.workflow.deleteStageBlockedSystem")
                : deleteBlocked === "inUse"
                  ? t("pages.workflow.deleteStageBlockedInUse")
                  : t("pages.workflow.deleteStageDesc")}
            </DialogDescription>
          </DialogHeader>
          {deleting && (
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
              {getStageLabel(deleting, t)}
            </p>
          )}
          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={!!deleteBlocked}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export { getStageColor, getStageIcon, REQUIRED_STAGE_IDS }
