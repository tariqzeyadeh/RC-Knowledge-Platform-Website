import type { ReactNode } from "react"
import { RENDER_STATIC_DEMO_DATA } from "@/config/demo-display"

export function DemoDataGate({ children }: { children: ReactNode }) {
  if (!RENDER_STATIC_DEMO_DATA) return null
  return children
}
