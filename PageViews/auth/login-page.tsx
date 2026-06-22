"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, LogIn } from "lucide-react"
import { getPostLoginDestination } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"
import { useLocale, useT } from "@/hooks/use-locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SessionUser } from "@/types/auth"

const ROYAL_COURT_LOGO_SRC = encodeURI("/شعار الديوان الملكي - SVG.svg")

export function LoginPage() {
  const t = useT()
  const { dict } = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setSession } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError(t("auth.invalidCredentials"))
        return
      }

      const data = (await res.json()) as { user: SessionUser }
      setSession(data.user)

      const destination = getPostLoginDestination(data.user.role, searchParams.get("next"))

      router.push(destination)
      router.refresh()
    } catch {
      setError(t("auth.loginError"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={ROYAL_COURT_LOGO_SRC}
            alt={dict.org.logoAlt}
            className="mb-4 h-14 w-auto"
          />
          <h1 className="font-heading text-2xl font-bold text-foreground">{dict.org.platform}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <LogIn className="h-5 w-5 text-primary" />
              {t("auth.signIn")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                <Lock className="h-4 w-4" />
                {submitting ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
