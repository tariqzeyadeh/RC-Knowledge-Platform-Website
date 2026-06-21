"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Search, Library, FilePlus2, Users, Repeat, ListChecks,
  ClipboardCheck, BarChart3, ShieldCheck, ScrollText, Scale, GraduationCap,
  LayoutGrid, Bell, Menu, X, Settings, LogOut, ChevronLeft,
} from "lucide-react"
import { getNavGroups, type NavGroup } from "@/config/navigation"
import { cn } from "@/utils"
import { ButtonLink } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import { useLocale } from "@/hooks/use-locale"
import { filterNavGroups, canUpload } from "@/lib/auth"
import type { SessionUser } from "@/types/auth"
import { LocaleSwitcher } from "./locale-switcher"
import { useShellContext } from "./shell-context"

const ROYAL_COURT_LOGO_SRC = encodeURI("/شعار الديوان الملكي - SVG.svg")

const BARE_PATHS = ["/login", "/forbidden"]

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`
  return name.slice(0, 2)
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Search, Library, FilePlus2, Users, Repeat, ListChecks,
  ClipboardCheck, BarChart3, ShieldCheck, ScrollText, Scale, GraduationCap, LayoutGrid,
}

function SidebarContent({
  navGroups,
  user,
  onNavigate,
  onLogout,
}: {
  navGroups: NavGroup[]
  user: SessionUser
  onNavigate?: () => void
  onLogout: () => void
}) {
  const pathname = usePathname()
  const { dict, locale, t } = useLocale()
  const org = dict.org

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-2 py-5">
        <img
          src={ROYAL_COURT_LOGO_SRC}
          alt={org.logoAlt}
          className="h-10 w-auto shrink-0"
        />
        <div className="leading-tight">
          <p className="font-heading text-sm font-bold text-sidebar-foreground">{org.platform}</p>
          <p className="text-[11px] text-sidebar-foreground/60">{org.parent}</p>
        </div>
      </div>

      <ScrollArea
        className="sidebar-scroll h-full min-h-0 flex-1"
        scrollbarClassName={cn(
          "data-vertical:px-0.5 data-vertical:border-s-0",
          locale === "ar"
            ? "data-vertical:left-0 data-vertical:right-auto"
            : "data-vertical:right-0 data-vertical:left-auto",
        )}
        thumbClassName="bg-sidebar-foreground/20 hover:bg-sidebar-primary/70"
      >
        <nav className="px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wide text-sidebar-foreground/45">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] ?? LayoutDashboard
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "nav-item group flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                        )}
                      >
                        <Icon className="nav-icon h-[18px] w-[18px] shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {active && <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-sidebar-primary" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-start transition-colors hover:bg-sidebar-accent/60"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
            {userInitials(user.displayName)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{user.displayName}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/55">{t(`auth.roles.${user.role}`)}</p>
          </div>
          <LogOut className="h-4 w-4 shrink-0 text-sidebar-foreground/55" />
        </button>
      </div>
    </div>
  )
}

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { meta } = useShellContext()
  const { title, description, breadcrumb } = meta
  const { dict, dir, t } = useLocale()
  const { user, loading, logout } = useAuth()
  const org = dict.org
  const [open, setOpen] = useState(false)

  const isBarePage = BARE_PATHS.includes(pathname)
  const navGroups = user ? filterNavGroups(getNavGroups(dict), user.role) : []
  const showUpload = user ? canUpload(user.role) : false

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  useEffect(() => {
    document.title = title ? `${title} | ${org.platform}` : org.platform
  }, [title, org.platform])

  useEffect(() => {
    if (!isBarePage && !loading && !user) {
      router.replace("/login")
    }
  }, [isBarePage, loading, user, router])

  if (isBarePage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-background">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-72 border-e border-sidebar-border bg-sidebar shadow-lg lg:block">
        <SidebarContent navGroups={navGroups} user={user} onLogout={() => void logout()} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={() => setOpen(false)} />
          <aside
            className={cn(
              "absolute inset-y-0 w-72 border-e border-sidebar-border bg-sidebar shadow-2xl",
              dir === "rtl" ? "start-0 animate-slide-in-right" : "start-0 animate-slide-in-left",
            )}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute end-3 top-4 rounded-md p-1 text-sidebar-foreground/70 transition-all duration-200 hover:scale-110 hover:bg-sidebar-accent/60"
              aria-label={t("shell.closeMenu")}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              navGroups={navGroups}
              user={user}
              onNavigate={() => setOpen(false)}
              onLogout={() => void logout()}
            />
          </aside>
        </div>
      )}

      <div className="min-w-0 max-w-full overflow-x-clip lg:ps-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="topbar-btn lg:hidden"
              aria-label={t("shell.openMenu")}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden min-w-0 flex-1 md:block">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("shell.searchPlaceholder")}
                className="h-9 w-full max-w-md rounded-md border border-input bg-card ps-9 pe-3 text-sm outline-none transition-all duration-200 focus:border-ring focus:shadow-sm focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
              <LocaleSwitcher />
              <Link href="/notifications" className="topbar-btn relative" aria-label={t("shell.notifications")}>
                <Bell className="h-5 w-5" />
                <span className="absolute end-1.5 top-1.5 h-2 w-2 animate-pulse-soft rounded-full bg-gold" />
              </Link>
              <button className="topbar-btn" aria-label={t("shell.settings")}>
                <Settings className="h-5 w-5" />
              </button>
              {showUpload && (
                <ButtonLink href="/upload" size="sm" className="ms-1 hidden sm:inline-flex">
                  <FilePlus2 className="h-4 w-4" />
                  {t("shell.newContribution")}
                </ButtonLink>
              )}
            </div>
          </div>
        </header>

        {(title || breadcrumb) && (
          <div className="animate-fade-in-down border-b border-border bg-card/50 px-4 py-6 sm:px-6 lg:px-8">
            {breadcrumb && (
              <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={t("common.breadcrumb")}>
                {breadcrumb.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronLeft className={cn("h-3 w-3", dir === "ltr" && "rotate-180")} />}
                    {c.href ? (
                      <Link href={c.href} className="hover:text-foreground">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-foreground">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {title && <h1 className="font-heading text-2xl font-bold text-foreground text-balance">{title}</h1>}
            {description && (
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
            )}
          </div>
        )}

        <main key={pathname} className="animate-fade-in min-w-0 max-w-full overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>
            {org.name} — {org.parent} · {org.platform} © 2026 · {t("common.classification")}
          </p>
        </footer>
      </div>
    </div>
  )
}
