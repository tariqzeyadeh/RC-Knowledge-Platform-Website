export type NavItem = { label: string; href: string; icon: string }
export type NavGroup = { title: string; items: NavItem[] }

export const navGroups: NavGroup[] = [
  {
    title: "الرئيسية",
    items: [
      { label: "لوحة المعرفة", href: "/", icon: "LayoutDashboard" },
      { label: "البحث المتقدم", href: "/search", icon: "Search" },
      { label: "مكتبة المعرفة", href: "/library", icon: "Library" },
    ],
  },
  {
    title: "المساهمة والمشاركة",
    items: [
      { label: "إنشاء ورفع محتوى", href: "/upload", icon: "FilePlus2" },
      { label: "مجتمعات الممارسة", href: "/communities", icon: "Users" },
      { label: "جلسات نقل المعرفة", href: "/transfer", icon: "Repeat" },
      { label: "الاحتياجات المعرفية", href: "/needs", icon: "ListChecks" },
    ],
  },
  {
    title: "الحوكمة والإدارة",
    items: [
      { label: "المراجعة والاعتماد", href: "/review", icon: "ClipboardCheck" },
      { label: "لوحات المؤشرات", href: "/analytics", icon: "BarChart3" },
      { label: "الصلاحيات والأدوار", href: "/admin/roles", icon: "ShieldCheck" },
      { label: "سجل التدقيق", href: "/admin/audit", icon: "ScrollText" },
      { label: "الحوكمة والامتثال", href: "/governance", icon: "Scale" },
    ],
  },
  {
    title: "المعرفة والتمكين",
    items: [
      { label: "التدريب والأدلة", href: "/training", icon: "GraduationCap" },
      { label: "دليل الميزات", href: "/features", icon: "LayoutGrid" },
    ],
  },
]
