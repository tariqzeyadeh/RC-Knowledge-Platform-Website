"use client"

import { cn } from "@/utils"
import { getConfidentialityMap, getStatusMap } from "@/config/presentation"
import { useLocale } from "@/hooks/use-locale"

export function ConfidentialityBadge({ level }: { level: string }) {
  const { dict } = useLocale()
  const map = getConfidentialityMap(dict)
  const c = map[level as keyof typeof map] ?? map.public
  return (
    <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium", c.cls)}>
      {c.name}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const { dict } = useLocale()
  const map = getStatusMap(dict)
  const s = map[status as keyof typeof map] ?? map.draft
  return (
    <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium", s.cls)}>
      {s.name}
    </span>
  )
}
