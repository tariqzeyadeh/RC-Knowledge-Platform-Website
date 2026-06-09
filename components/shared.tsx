import Link from "next/link"
import { FileText, Star, Eye, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { confidentialityMap, type KnowledgeAsset } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export function ConfidentialityBadge({ level }: { level: string }) {
  const c = confidentialityMap[level] ?? confidentialityMap.public
  return <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium", c.cls)}>{c.name}</span>
}

const statusMap: Record<string, { name: string; cls: string }> = {
  published: { name: "منشور", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  review: { name: "قيد المراجعة", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  draft: { name: "مسودة", cls: "bg-muted text-muted-foreground border-border" },
}

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? statusMap.draft
  return <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium", s.cls)}>{s.name}</span>
}

export function AssetCard({ asset, categoryName }: { asset: KnowledgeAsset; categoryName?: string }) {
  return (
    <Link
      href={`/knowledge/${asset.id}`}
      className="interactive-card group flex flex-col rounded-lg border border-border bg-card p-4 hover:border-primary/40"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
          <FileText className="icon-hover h-5 w-5" />
        </span>
        <ConfidentialityBadge level={asset.confidentiality} />
      </div>
      <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{asset.type}</span>
        {categoryName && <><span>·</span><span>{categoryName}</span></>}
      </div>
      <h3 className="mb-2 line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
        {asset.title}
      </h3>
      <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">{asset.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {asset.keywords.slice(0, 2).map((k) => (
          <Badge key={k} variant="secondary" className="text-[10px] font-normal">{k}</Badge>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{asset.views.toLocaleString("ar-SA")}</span>
        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{asset.rating}</span>
        <span className="mr-auto flex items-center gap-1"><Clock className="h-3 w-3" />v{asset.version}</span>
      </div>
    </Link>
  )
}

export function SectionHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
      {action && <div className="animate-scale-in">{action}</div>}
    </div>
  )
}
