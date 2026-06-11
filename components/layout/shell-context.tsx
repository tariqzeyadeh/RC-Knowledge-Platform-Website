"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type ShellMeta = {
  title?: string
  description?: string
  breadcrumb?: { label: string; href?: string }[]
}

type ShellContextValue = {
  meta: ShellMeta
  setMeta: (meta: ShellMeta) => void
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function ShellProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<ShellMeta>({})
  const value = useMemo(() => ({ meta, setMeta }), [meta])
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export function useShellContext() {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error("useShellContext must be used within ShellProvider")
  return ctx
}
