export type RankProgressItem = {
  id: string
  label: string
  meta: string
  percent: number
  tone?: "primary" | "gold"
}

export function RankProgressList({ items }: { items: RankProgressItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{item.label}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{item.meta}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${item.tone === "gold" ? "bg-gold" : "bg-primary"}`}
              style={{ width: `${Math.min(100, Math.max(0, item.percent))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
