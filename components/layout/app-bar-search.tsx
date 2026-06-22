"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Clock, Search } from "lucide-react"
import { useLocale, useT } from "@/hooks/use-locale"
import { getSearchSuggestions } from "@/services/knowledge/asset-search.service"
import { cn } from "@/lib/utils"

function highlightMatch(term: string, query: string) {
  const trimmed = query.trim()
  if (!trimmed) return term

  const lowerTerm = term.toLowerCase()
  const lowerQuery = trimmed.toLowerCase()
  const index = lowerTerm.indexOf(lowerQuery)
  if (index === -1) return term

  const before = term.slice(0, index)
  const match = term.slice(index, index + trimmed.length)
  const after = term.slice(index + trimmed.length)

  return (
    <>
      {before}
      <span className="font-semibold text-foreground">{match}</span>
      {after}
    </>
  )
}

export function AppBarSearch() {
  const t = useT()
  const { locale } = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setValue("")
    setOpen(false)
    setActiveIndex(-1)
  }, [pathname])

  const suggestions = useMemo(
    () => (open ? getSearchSuggestions(value, locale) : []),
    [open, value, locale],
  )

  const showDropdown = open && suggestions.length > 0
  const isPopular = !value.trim()

  function navigateToSearch(query: string) {
    const trimmed = query.trim()
    const href = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search"
    setValue("")
    setOpen(false)
    setActiveIndex(-1)
    router.push(href)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigateToSearch(suggestions[activeIndex])
      return
    }
    navigateToSearch(value)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === "ArrowDown" && value.trim()) {
        setOpen(true)
        setActiveIndex(0)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, -1))
        break
      case "Escape":
        setOpen(false)
        setActiveIndex(-1)
        break
      case "Enter":
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          e.preventDefault()
          navigateToSearch(suggestions[activeIndex])
        }
        break
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative hidden min-w-0 flex-1 md:block">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("shell.searchPlaceholder")}
          className="h-9 w-full max-w-md rounded-md border border-input bg-card ps-9 pe-3 text-sm outline-none transition-all duration-200 focus:border-ring focus:shadow-sm focus:ring-2 focus:ring-ring/20"
          aria-label={t("shell.searchPlaceholder")}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls={showDropdown ? "app-bar-search-suggestions" : undefined}
          aria-activedescendant={
            showDropdown && activeIndex >= 0 ? `app-bar-search-option-${activeIndex}` : undefined
          }
          role="combobox"
          autoComplete="off"
        />
      </form>

      {showDropdown && (
        <div
          id="app-bar-search-suggestions"
          role="listbox"
          className="absolute start-0 top-full z-50 mt-1 w-full max-w-md overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          <p className="border-b border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {isPopular ? t("shell.popularSearches") : t("shell.suggestions")}
          </p>
          <ul className="max-h-64 overflow-y-auto py-1">
            {suggestions.map((term, index) => (
              <li key={term} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  id={`app-bar-search-option-${index}`}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-start text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    index === activeIndex && "bg-accent text-accent-foreground",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => navigateToSearch(term)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {isPopular ? (
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 truncate text-muted-foreground">
                    {highlightMatch(term, value)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
