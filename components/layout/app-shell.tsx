"use client"

import type React from "react"
import { useLayoutEffect } from "react"
import { useShellContext } from "./shell-context"

export function AppShell({
  children,
  title,
  description,
  breadcrumb,
}: {
  children: React.ReactNode
  title?: string
  description?: string
  breadcrumb?: { label: string; href?: string }[]
}) {
  const { setMeta } = useShellContext()
  const breadcrumbKey = breadcrumb ? JSON.stringify(breadcrumb) : ""

  useLayoutEffect(() => {
    setMeta({ title, description, breadcrumb })
  }, [title, description, breadcrumb, breadcrumbKey, setMeta])

  return <>{children}</>
}
