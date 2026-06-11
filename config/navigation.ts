import type { Dictionary } from "@/i18n"

export type NavItem = { label: string; href: string; icon: string }
export type NavGroup = { title: string; items: NavItem[] }

type NavItemDef = { href: string; icon: string; labelKey: keyof Dictionary["nav"]["items"] }
type NavGroupDef = { titleKey: keyof Dictionary["nav"]["groups"]; items: NavItemDef[] }

/** Sidebar IA — maps to SECI modules and F-01–F-30 feature areas */
export const navStructure: NavGroupDef[] = [
  {
    titleKey: "main",
    items: [
      { labelKey: "dashboard", href: "/", icon: "LayoutDashboard" },
      { labelKey: "search", href: "/search", icon: "Search" },
      { labelKey: "library", href: "/library", icon: "Library" },
    ],
  },
  {
    titleKey: "contribution",
    items: [
      { labelKey: "upload", href: "/upload", icon: "FilePlus2" },
      { labelKey: "communities", href: "/communities", icon: "Users" },
      { labelKey: "transfer", href: "/transfer", icon: "Repeat" },
      { labelKey: "needs", href: "/needs", icon: "ListChecks" },
    ],
  },
  {
    titleKey: "governance",
    items: [
      { labelKey: "review", href: "/review", icon: "ClipboardCheck" },
      { labelKey: "analytics", href: "/analytics", icon: "BarChart3" },
      { labelKey: "roles", href: "/admin/roles", icon: "ShieldCheck" },
      { labelKey: "audit", href: "/admin/audit", icon: "ScrollText" },
      { labelKey: "governance", href: "/governance", icon: "Scale" },
    ],
  },
  {
    titleKey: "enablement",
    items: [
      { labelKey: "training", href: "/training", icon: "GraduationCap" },
      { labelKey: "features", href: "/features", icon: "LayoutGrid" },
    ],
  },
]

export function getNavGroups(dict: Dictionary): NavGroup[] {
  return navStructure.map((group) => ({
    title: dict.nav.groups[group.titleKey],
    items: group.items.map((item) => ({
      href: item.href,
      icon: item.icon,
      label: dict.nav.items[item.labelKey],
    })),
  }))
}

/** @deprecated Use getNavGroups(dict) — kept for legacy imports */
export const navGroups: NavGroup[] = []
