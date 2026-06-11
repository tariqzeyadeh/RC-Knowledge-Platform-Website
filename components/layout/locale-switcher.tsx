"use client"

// import { Languages } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"
import type { Locale } from "@/i18n"
import { cn } from "@/utils"

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale()

  const options: { id: Locale; label: string }[] = [
    { id: "ar", label: t("locale.ar") },
    { id: "en", label: t("locale.en") },
  ]

  return (
    <div
      className="topbar-btn flex items-center gap-1 p-0.5"
      role="group"
      aria-label={t("locale.switch")}
    >
      {/* <Languages className="mx-1.5 h-4 w-4 shrink-0 text-muted-foreground" /> */}
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLocale(opt.id)}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium transition-colors",
            locale === opt.id
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
