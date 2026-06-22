"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import type { SessionUser } from "@/types/auth"

type AuthContextValue = {
  user: SessionUser | null
  loading: boolean
  setSession: (user: SessionUser | null) => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const setSession = useCallback((sessionUser: SessionUser | null) => {
    setUser(sessionUser)
    setLoading(false)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" })
      const data = (await res.json()) as { user: SessionUser | null }
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [pathname, refresh])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
    setUser(null)
    window.location.assign("/login")
  }, [])

  const value = useMemo(
    () => ({ user, loading, setSession, logout, refresh }),
    [user, loading, setSession, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
