import { ar, type Dictionary } from "./locales/ar"
import { en } from "./locales/en"

export type Locale = "ar" | "en"

export const locales: Locale[] = ["ar", "en"]
export const defaultLocale: Locale = "ar"

const dictionaries: Record<Locale, Dictionary> = { ar, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ar
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr"
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en"
}

export type { Dictionary }
