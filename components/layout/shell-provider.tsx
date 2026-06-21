"use client"

import type { ReactNode } from "react"
import { LocaleProvider } from "@/hooks/use-locale"
import { AuthProvider } from "@/hooks/use-auth"
import { ShellProvider } from "./shell-context"
import { ShellLayout } from "./shell-layout"

export function AppShellProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <ShellProvider>
          <ShellLayout>{children}</ShellLayout>
        </ShellProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}
