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
import {
  defaultLocale,
  getDictionary,
  getDir,
  isLocale,
  type Dictionary,
  type Locale,
} from "@/i18n"

const LOCALE_COOKIE = "locale"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type LocaleContextValue = {
  locale: Locale
  dir: "rtl" | "ltr"
  dict: Dictionary
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  formatNumber: (value: number) => string
  formatList: (items: string[]) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return defaultLocale
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))
  return isLocale(match?.[1]) ? match[1] : defaultLocale
}

function writeCookieLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`
}

function resolveKey(dict: Dictionary, key: string): string {
  const parts = key.split(".")
  let current: unknown = dict
  for (const part of parts) {
    if (current == null || typeof current !== "object") return key
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === "string" ? current : key
}

function applyDocumentLocale(locale: Locale) {
  const dir = getDir(locale)
  document.documentElement.lang = locale
  document.documentElement.dir = dir
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const initial = readCookieLocale()
    setLocaleState(initial)
    applyDocumentLocale(initial)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    writeCookieLocale(next)
    applyDocumentLocale(next)
  }, [])

  const dict = useMemo(() => getDictionary(locale), [locale])
  const dir = getDir(locale)
  const t = useCallback((key: string) => resolveKey(dict, key), [dict])
  const formatNumber = useCallback(
    (value: number) => value.toLocaleString(locale === "ar" ? "ar-SA" : "en-US"),
    [locale],
  )
  const formatList = useCallback(
    (items: string[]) =>
      new Intl.ListFormat(locale === "ar" ? "ar-SA" : "en-US", {
        style: "long",
        type: "conjunction",
      }).format(items),
    [locale],
  )

  const value = useMemo(
    () => ({ locale, dir, dict, setLocale, t, formatNumber, formatList }),
    [locale, dir, dict, setLocale, t, formatNumber, formatList],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}

export function useT() {
  return useLocale().t
}
