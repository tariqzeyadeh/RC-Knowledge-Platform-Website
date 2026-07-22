"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Eye,
  GitBranch,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Timer,
  Trash2,
  Workflow,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { useLocale, useT } from "@/hooks/use-locale"
import {
  // countRoutingRulesForWorkflow, // STATIC_DEMO_DATA: fixture routing rules
  summarizeWorkflows,
} from "@/services/admin/workflow.service"
import {
  getStageColor,
  getStageIcon,
  getStageLabel,
  REQUIRED_STAGE_IDS,
  WorkflowStageManager,
} from "@/pages/admin/workflow-stage-manager"
import { DemoDataGate } from "@/components/shared"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import type { WorkflowDefinition, WorkflowRoutingRule, WorkflowStage } from "@/types/workflow"
import {
  getOrderedStageIds,
  isValidWorkflowStages,
  normalizeWorkflowStages,
} from "@/types/workflow"
import { cn } from "@/utils"

type FormMode = "create" | "edit"

function emptyWorkflow(): WorkflowDefinition {
  return {
    id: `WF-${Date.now().toString(36).toUpperCase()}`,
    name: "",
    description: "",
    stages: ["draft", "review", "approval", "publish"],
    default: false,
    active: true,
    createdAt: new Date().toISOString().slice(0, 10),
  }
}

function PipelinePreview({
  stageIds,
  stageConfig,
  compact,
}: {
  stageIds: string[]
  stageConfig: WorkflowStage[]
  compact?: boolean
}) {
  const t = useT()
  const { dir } = useLocale()

  const stageMap = useMemo(
    () => new Map(stageConfig.map((stage) => [stage.id, stage])),
    [stageConfig],
  )

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", compact ? "py-2" : "py-4")}>
      {stageIds.map((stageId, i) => {
        const stage = stageMap.get(stageId)
        const Icon = getStageIcon(stageId)
        const label = stage ? getStageLabel(stage, t) : stageId
        return (
          <div key={stageId} className="flex items-center gap-2">
            <div
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 text-center",
                compact ? "min-w-[5.5rem]" : "min-w-[7.5rem] gap-2 px-4 py-3",
                getStageColor(stageId),
              )}
            >
              <Icon className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
              <span className={cn("font-semibold", compact ? "text-[10px]" : "text-xs")}>{label}</span>
            </div>
            {i < stageIds.length - 1 && (
              <ArrowLeft
                className={cn("h-4 w-4 shrink-0 text-muted-foreground", dir === "ltr" && "rotate-180")}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function WorkflowPage() {
  const t = useT()
  const { formatNumber } = useLocale()
  // STATIC_DEMO_DATA: fixture workflow metrics — restore getWorkflowMetrics() when re-enabling demo data
  const metrics = { draft: 0, review: 0, approval: 0, publish: 0, avgCycleDays: 0, rejected: 0 }

  const [stageConfig, setStageConfig] = useState<WorkflowStage[]>([])
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([])
  const [routingRules, setRoutingRules] = useState<WorkflowRoutingRule[]>([])
  const [query, setQuery] = useState("")
  const [viewing, setViewing] = useState<WorkflowDefinition | null>(null)
  const [formMode, setFormMode] = useState<FormMode>("create")
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<WorkflowDefinition | null>(null)
  const [deleting, setDeleting] = useState<WorkflowDefinition | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/workflow-stages", { cache: "no-store" }),
      fetch("/api/admin/workflows", { cache: "no-store" }),
      fetch("/api/admin/workflow-routing-rules", { cache: "no-store" }),
    ])
      .then(async ([stagesRes, workflowsRes, rulesRes]) => {
        const stagesPayload = (await stagesRes.json()) as { stages: WorkflowStage[] }
        const workflowsPayload = (await workflowsRes.json()) as { workflows: WorkflowDefinition[] }
        const rulesPayload = (await rulesRes.json()) as { rules: WorkflowRoutingRule[] }
        setStageConfig(stagesPayload.stages ?? [])
        setWorkflows(workflowsPayload.workflows ?? [])
        setRoutingRules(rulesPayload.rules ?? [])
      })
      .catch(() => undefined)
  }, [])

  const stats = summarizeWorkflows(workflows)

  const orderedStageIds = useMemo(() => getOrderedStageIds(stageConfig), [stageConfig])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return workflows
    return workflows.filter((workflow) =>
      [
        workflow.id,
        workflow.name,
        workflow.description,
        workflow.stages
          .map((stageId) => {
            const stage = stageConfig.find((item) => item.id === stageId)
            return stage ? getStageLabel(stage, t) : stageId
          })
          .join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [query, stageConfig, t, workflows])

  const metricCards = [
    { key: "draft" as const, value: metrics.draft },
    { key: "review" as const, value: metrics.review },
    { key: "approval" as const, value: metrics.approval },
    { key: "publish" as const, value: metrics.publish },
  ]

  function openCreate() {
    setFormMode("create")
    setForm(emptyWorkflow())
    setFormOpen(true)
  }

  function openEdit(workflow: WorkflowDefinition) {
    setFormMode("edit")
    setForm({ ...workflow, stages: [...workflow.stages] })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setForm(null)
  }

  function updateForm<K extends keyof WorkflowDefinition>(key: K, value: WorkflowDefinition[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function toggleOptionalStage(stageId: string, checked: boolean) {
    if (!form) return
    const current = new Set(form.stages)
    if (checked) current.add(stageId)
    else current.delete(stageId)
    for (const requiredId of REQUIRED_STAGE_IDS) current.add(requiredId)
    updateForm("stages", normalizeWorkflowStages([...current], stageConfig))
  }

  function saveForm() {
    if (!form?.name.trim() || !form.description.trim() || !isValidWorkflowStages(form.stages, stageConfig)) return

    const saved: WorkflowDefinition = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      stages: normalizeWorkflowStages(form.stages, stageConfig),
    }

    const request =
      formMode === "create"
        ? fetch("/api/admin/workflows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saved),
          })
        : fetch(`/api/admin/workflows/${saved.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saved),
          })

    request
      .then(async (response) => {
        if (!response.ok) throw new Error("save_failed")
        return response.json() as Promise<{ workflow: WorkflowDefinition }>
      })
      .then((payload) => {
        const workflow = payload.workflow
        if (workflow.default) {
          setWorkflows((prev) => {
            const updated = prev.map((item) =>
              item.id === workflow.id ? workflow : { ...item, default: false },
            )
            return formMode === "create"
              ? [workflow, ...updated.filter((w) => w.id !== workflow.id)]
              : updated
          })
        } else if (formMode === "create") {
          setWorkflows((prev) => [workflow, ...prev])
        } else {
          setWorkflows((prev) => prev.map((item) => (item.id === workflow.id ? workflow : item)))
        }
        if (viewing?.id === workflow.id) setViewing(workflow)
        closeForm()
      })
      .catch(() => undefined)
  }

  function confirmDelete() {
    if (!deleting) return
    fetch(`/api/admin/workflows/${deleting.id}`, { method: "DELETE" })
      .then(async (response) => {
        if (!response.ok) throw new Error("delete_failed")
        setWorkflows((prev) => {
          const next = prev.filter((item) => item.id !== deleting.id)
          if (next.length > 0 && !next.some((w) => w.default)) {
            next[0] = { ...next[0], default: true }
          }
          return next
        })
        setDeleting(null)
        if (viewing?.id === deleting.id) setViewing(null)
      })
      .catch(() => undefined)
  }

  function workflowName(workflowId: string) {
    return workflows.find((w) => w.id === workflowId)?.name ?? workflowId
  }

  const deleteBlocked =
    deleting &&
    (workflows.length === 1
      ? "lastWorkflow"
      : routingRules.filter((rule) => rule.workflowId === deleting.id).length > 0
        ? "hasRules"
        : null)

  return (
    <AppShell
      title={t("pages.workflow.title")}
      description={t("pages.workflow.description")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("pages.workflow.title") }]}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <GitBranch className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.totalWorkflows")}</p>
              <p className="font-heading text-xl font-bold text-foreground">{formatNumber(stats.total)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Workflow className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.activeWorkflows")}</p>
              <p className="font-heading text-xl font-bold text-foreground">{formatNumber(stats.active)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="flex items-center gap-3 p-4">
            <Badge variant="secondary" className="shrink-0">{t("pages.workflow.defaultTemplate")}</Badge>
            <p className="text-sm font-medium text-foreground">{stats.defaultWorkflow}</p>
            <Badge variant="outline" className="ms-auto shrink-0 font-normal">
              {t("pages.workflow.featureRef")}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <GitBranch className="h-5 w-5 text-primary" />
            {t("pages.workflow.workflowsTitle")}
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("pages.workflow.searchPlaceholder")}
                className="pe-9"
              />
            </div>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {t("pages.workflow.createWorkflow")}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-start">
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.workflowColumns.id")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.workflowColumns.name")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.workflowColumns.stages")}</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.workflow.workflowColumns.status")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("pages.workflow.workflowColumns.created")}</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t("pages.workflow.workflowColumns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((workflow) => (
                <tr
                  key={workflow.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/30",
                    viewing?.id === workflow.id && "bg-secondary/20",
                  )}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{workflow.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{workflow.name}</p>
                      {workflow.default && (
                        <Badge className="text-[10px]">{t("pages.workflow.defaultTemplate")}</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{workflow.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {workflow.stages.map((stageId) => {
                        const stage = stageConfig.find((item) => item.id === stageId)
                        return (
                          <Badge key={stageId} variant="outline" className="text-[10px] font-normal">
                            {stage ? getStageLabel(stage, t) : stageId}
                          </Badge>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                        workflow.active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {workflow.active ? t("pages.workflow.statusActive") : t("pages.workflow.statusInactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{workflow.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewing(workflow)}
                        aria-label={t("pages.workflow.viewWorkflow")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(workflow)}
                        aria-label={t("pages.workflow.editWorkflow")}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(workflow)}
                        aria-label={t("pages.workflow.deleteWorkflow")}
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
      </section>

      {viewing && (
        <Card className="mb-8 overflow-hidden border-primary/20">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div>
              <CardTitle className="font-heading text-base">{viewing.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{viewing.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(viewing)}>
                <Pencil className="h-4 w-4" />
                {t("pages.workflow.editWorkflow")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setViewing(null)}>
                {t("common.cancel")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <PipelinePreview stageIds={viewing.stages} stageConfig={stageConfig} />
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t("pages.workflow.rejectLoop")}</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-start">
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">{t("pages.workflow.columns.stage")}</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">{t("pages.workflow.columns.role")}</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">{t("pages.workflow.columns.sla")}</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">{t("pages.workflow.columns.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {stageConfig
                    .filter((stage) => viewing.stages.includes(stage.id))
                    .map((stage) => (
                      <tr key={stage.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5">
                          <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium", getStageColor(stage.id))}>
                            {getStageLabel(stage, t)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{t(`auth.roles.${stage.role}`)}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {stage.slaHours > 0
                            ? `${formatNumber(stage.slaHours)} ${t("pages.workflow.hours")}`
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {stage.actions.map((action) => (
                              <Badge key={action} variant="outline" className="text-[10px] font-normal">
                                {t(`pages.workflow.actions.${action}`)}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <DemoDataGate>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((item) => (
          <Card key={item.key}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{t(`enums.reviewStage.${item.key}`)}</p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground">{formatNumber(item.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Timer className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.avgCycle")}</p>
              <p className="font-heading text-xl font-bold text-foreground">
                {formatNumber(metrics.avgCycleDays)} {t("pages.workflow.days")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <RotateCcw className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("pages.workflow.rejected")}</p>
              <p className="font-heading text-xl font-bold text-foreground">{formatNumber(metrics.rejected)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </DemoDataGate>

      <WorkflowStageManager
        stages={stageConfig}
        workflows={workflows}
        onChange={setStageConfig}
      />

      <section>
        <h2 className="mb-4 font-heading text-base font-bold text-foreground">{t("pages.workflow.routingTitle")}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{t("pages.workflow.routingDesc")}</p>
        <div className="space-y-2">
          {routingRules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{rule.id}</span>
                <span className="text-sm text-foreground">{t(`pages.workflow.rules.${rule.conditionKey}`)}</span>
              </div>
              <Badge variant="secondary">{workflowName(rule.workflowId)}</Badge>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? t("pages.workflow.createTitle") : t("pages.workflow.editTitle")}
            </DialogTitle>
            <DialogDescription>{t("pages.workflow.formDesc")}</DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-1">
              {formMode === "edit" && (
                <div className="space-y-2">
                  <Label>{t("pages.workflow.workflowColumns.id")}</Label>
                  <Input value={form.id} disabled />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="wf-name">{t("pages.workflow.workflowColumns.name")}</Label>
                <Input
                  id="wf-name"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wf-desc">{t("pages.workflow.workflowColumns.description")}</Label>
                <Textarea
                  id="wf-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>{t("pages.workflow.workflowColumns.stages")}</Label>
                <p className="text-xs text-muted-foreground">{t("pages.workflow.stagesHint")}</p>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {orderedStageIds.map((stageId) => {
                    const stage = stageConfig.find((item) => item.id === stageId)
                    const isRequired = REQUIRED_STAGE_IDS.includes(stageId as (typeof REQUIRED_STAGE_IDS)[number])
                    const checked = form.stages.includes(stageId)
                    return (
                      <label
                        key={stageId}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2 py-1.5",
                          isRequired ? "opacity-80" : "hover:bg-muted/50 cursor-pointer",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border accent-primary"
                          checked={checked}
                          disabled={isRequired}
                          onChange={(e) => {
                            if (!isRequired) toggleOptionalStage(stageId, e.target.checked)
                          }}
                        />
                        <span className="text-sm text-foreground">
                          {stage ? getStageLabel(stage, t) : stageId}
                        </span>
                        {isRequired && (
                          <Badge variant="outline" className="ms-auto text-[10px] font-normal">
                            {t("pages.workflow.requiredStage")}
                          </Badge>
                        )}
                      </label>
                    )
                  })}
                </div>
                <PipelinePreview
                  stageIds={normalizeWorkflowStages(form.stages, stageConfig)}
                  stageConfig={stageConfig}
                  compact
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <input
                    id="wf-default"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-primary"
                    checked={form.default}
                    onChange={(e) => updateForm("default", e.target.checked)}
                  />
                  <Label htmlFor="wf-default" className="cursor-pointer text-sm font-normal">
                    {t("pages.workflow.setAsDefault")}
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>{t("pages.workflow.workflowColumns.status")}</Label>
                  <Select
                    value={form.active ? "active" : "inactive"}
                    onValueChange={(v) => updateForm("active", v === "active")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {form.active ? t("pages.workflow.statusActive") : t("pages.workflow.statusInactive")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("pages.workflow.statusActive")}</SelectItem>
                      <SelectItem value="inactive">{t("pages.workflow.statusInactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t-0 bg-transparent px-3 pt-3 sm:justify-end">
            <Button variant="outline" onClick={closeForm}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={saveForm}
              disabled={!form?.name.trim() || !form?.description.trim() || !isValidWorkflowStages(form?.stages ?? [], stageConfig)}
            >
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("pages.workflow.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {deleteBlocked === "hasRules"
                ? t("pages.workflow.deleteBlockedRules")
                : deleteBlocked === "lastWorkflow"
                  ? t("pages.workflow.deleteBlockedLast")
                  : t("pages.workflow.deleteDesc")}
            </DialogDescription>
          </DialogHeader>
          {deleting && (
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground">
              {deleting.name}
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
    </AppShell>
  )
}
