import type { Locale } from "@/i18n"
import * as analyticsAr from "@/data/fixtures/analytics"
import * as collaborationAr from "@/data/fixtures/collaboration"
import * as featuresAr from "@/data/fixtures/features"
import * as governanceAr from "@/data/fixtures/governance"
import * as knowledgeAr from "@/data/fixtures/knowledge"
import * as seciAr from "@/data/fixtures/seci"
import * as analyticsEn from "@/data/fixtures/locale/en/analytics"
import * as collaborationEn from "@/data/fixtures/locale/en/collaboration"
import * as featuresEn from "@/data/fixtures/locale/en/features"
import * as governanceEn from "@/data/fixtures/locale/en/governance"
import * as knowledgeEn from "@/data/fixtures/locale/en/knowledge"
import * as seciEn from "@/data/fixtures/locale/en/seci"

type FixtureModule = Record<string, unknown>

function pick<T extends FixtureModule>(locale: Locale, ar: T, en: T): T {
  return locale === "en" ? en : ar
}

export const localizedData = {
  knowledge: (locale: Locale) => pick(locale, knowledgeAr, knowledgeEn as typeof knowledgeAr),
  collaboration: (locale: Locale) => pick(locale, collaborationAr, collaborationEn),
  analytics: (locale: Locale) => pick(locale, analyticsAr, analyticsEn),
  governance: (locale: Locale) => pick(locale, governanceAr, governanceEn),
  features: (locale: Locale) => pick(locale, featuresAr, featuresEn),
  seci: (locale: Locale) => pick(locale, seciAr, seciEn),
}
