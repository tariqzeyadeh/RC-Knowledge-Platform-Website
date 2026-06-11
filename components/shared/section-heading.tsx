export function SectionHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
      {action && <div className="animate-scale-in">{action}</div>}
    </div>
  )
}
