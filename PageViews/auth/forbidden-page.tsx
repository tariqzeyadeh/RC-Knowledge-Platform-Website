"use client"

import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useT } from "@/hooks/use-locale"
import { getRoleLanding } from "@/lib/auth"
import { ButtonLink } from "@/components/ui/button"

export function ForbiddenPage() {
  const t = useT()
  const { user } = useAuth()
  const homeHref = user ? getRoleLanding(user.role) : "/login"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <p className="font-heading text-6xl font-bold text-foreground">403</p>
      <h1 className="mt-2 font-heading text-2xl font-bold text-foreground">{t("auth.forbiddenTitle")}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t("auth.forbiddenDesc")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href={homeHref}>{t("auth.backToHome")}</ButtonLink>
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          {t("auth.switchAccount")}
        </Link>
      </div>
    </div>
  )
}
