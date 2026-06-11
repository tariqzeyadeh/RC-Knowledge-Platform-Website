"use client"

import type { ReactNode } from "react"
import { LocaleProvider } from "@/hooks/use-locale"
import { ShellProvider } from "./shell-context"
import { ShellLayout } from "./shell-layout"

export function AppShellProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ShellProvider>
        <ShellLayout>{children}</ShellLayout>
      </ShellProvider>
    </LocaleProvider>
  )
}
