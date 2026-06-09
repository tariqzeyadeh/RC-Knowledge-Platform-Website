"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Search, Library, FilePlus2, Users, Repeat, ListChecks,
  ClipboardCheck, BarChart3, ShieldCheck, ScrollText, Scale, GraduationCap,
  LayoutGrid, Bell, Menu, X, Settings, LogOut, ChevronLeft,
} from "lucide-react"
import { navGroups } from "@/components/nav-items"
import { ORG } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ButtonLink } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const ROYAL_COURT_LOGO_SRC = encodeURI("/شعار الديوان الملكي - SVG.svg")

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Search, Library, FilePlus2, Users, Repeat, ListChecks,
  ClipboardCheck, BarChart3, ShieldCheck, ScrollText, Scale, GraduationCap, LayoutGrid,
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-2 py-5">
        <img
          src={ROYAL_COURT_LOGO_SRC}
          alt="المملكة العربية السعودية — الديوان الملكي"
          className="h-10 w-auto shrink-0"
        />
        <div className="leading-tight">
          <p className="font-heading text-sm font-bold text-sidebar-foreground">{ORG.platform}</p>
          <p className="text-[11px] text-sidebar-foreground/60">{ORG.parent}</p>
        </div>
      </div>

      <ScrollArea
        className="sidebar-scroll min-h-0 flex-1"
        scrollbarClassName="data-vertical:left-0 data-vertical:right-auto data-vertical:border-s-0 data-vertical:px-0.5"
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
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
            عخ
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-medium text-sidebar-foreground">عبدالعزيز العتيبي</p>
            <p className="truncate text-[11px] text-sidebar-foreground/55">معتمد · المشتريات</p>
          </div>
          <LogOut className="h-4 w-4 text-sidebar-foreground/55" />
        </div>
      </div>
    </div>
  )
}

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
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — desktop (right side for RTL) */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-72 border-s border-sidebar-border bg-sidebar shadow-lg lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72 animate-slide-in-right border-s border-sidebar-border bg-sidebar shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute left-3 top-4 rounded-md p-1 text-sidebar-foreground/70 transition-all duration-200 hover:scale-110 hover:bg-sidebar-accent/60"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pr-72">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              className="topbar-btn lg:hidden"
              aria-label="فتح القائمة"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden flex-1 md:block">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="ابحث في المعرفة المؤسسية..."
                className="h-9 w-full max-w-md rounded-md border border-input bg-card pr-9 pl-3 text-sm outline-none transition-all duration-200 focus:border-ring focus:shadow-sm focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
              <Link
                href="/notifications"
                className="topbar-btn relative"
                aria-label="الإشعارات"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse-soft rounded-full bg-gold" />
              </Link>
              <button className="topbar-btn" aria-label="الإعدادات">
                <Settings className="h-5 w-5" />
              </button>
              <ButtonLink href="/upload" size="sm" className="mr-1 hidden sm:inline-flex">
                <FilePlus2 className="h-4 w-4" />
                مساهمة جديدة
              </ButtonLink>
            </div>
          </div>
        </header>

        {/* Page header */}
        {(title || breadcrumb) && (
          <div className="animate-fade-in-down border-b border-border bg-card/50 px-4 py-6 sm:px-6 lg:px-8">
            {breadcrumb && (
              <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="مسار التنقل">
                {breadcrumb.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronLeft className="h-3 w-3" />}
                    {c.href ? (
                      <Link href={c.href} className="hover:text-foreground">{c.label}</Link>
                    ) : (
                      <span className="text-foreground">{c.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {title && <h1 className="font-heading text-2xl font-bold text-foreground text-balance">{title}</h1>}
            {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>}
          </div>
        )}

        <main key={pathname} className="animate-fade-in px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>{ORG.name} — {ORG.parent} · {ORG.platform} © 2026 · تصنيف: مقيد – داخلي</p>
        </footer>
      </div>
    </div>
  )
}
