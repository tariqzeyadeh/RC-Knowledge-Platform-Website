import { asc, desc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import {
  auditLogEntries,
  complianceMatrix,
  governanceRoles,
  monthlyActivity,
  platformFeatures,
  seciLayers,
  securityControls,
  topContributors,
  trainingPrograms,
} from "@/lib/db/schema"
import { getLookupLabel } from "@/lib/db/repositories/lookup.repository"
import { readCachedLookupLabel } from "@/lib/db/repositories/lookup-cache"
import type { Locale } from "@/i18n"
import type { AuditEntry, Feature, Role, SeciLayer } from "@/types/domain"

export async function listGovernanceRoles(locale: Locale = "ar"): Promise<Role[]> {
  const db = getDb()
  const rows = await db.select().from(governanceRoles).orderBy(asc(governanceRoles.sortOrder))

  return rows.map((row) => ({
    id: row.id,
    name: locale === "en" && row.nameEn ? row.nameEn : row.nameAr,
    users: row.users,
    desc: locale === "en" && row.descEn ? row.descEn : row.descAr,
    permissions: row.permissions,
  }))
}

export async function listAuditLog(locale: Locale = "ar"): Promise<AuditEntry[]> {
  const db = getDb()
  const rows = await db.select().from(auditLogEntries).orderBy(desc(auditLogEntries.time))

  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      user: row.user,
      action: row.action,
      target: row.target,
      time: row.time,
      ip: row.ip,
      result: (await getLookupLabel("audit_result", row.resultId, locale)) as AuditEntry["result"],
    })),
  )
}

export async function listSeciLayers(locale: Locale = "ar"): Promise<SeciLayer[]> {
  const db = getDb()
  const rows = await db.select().from(seciLayers).orderBy(asc(seciLayers.sortOrder))

  return rows.map((row) => ({
    id: row.id,
    title: locale === "en" && row.titleEn ? row.titleEn : row.titleAr,
    seci: locale === "en" && row.seciEn ? row.seciEn : row.seciAr,
    knowledgeType: locale === "en" && row.knowledgeTypeEn ? row.knowledgeTypeEn : row.knowledgeTypeAr,
    color: row.color,
    desc: locale === "en" && row.descEn ? row.descEn : row.descAr,
  }))
}

export async function listFeatures(locale: Locale = "ar"): Promise<Feature[]> {
  const db = getDb()
  const rows = await db.select().from(platformFeatures).orderBy(asc(platformFeatures.sortOrder))

  return rows.map((row) => ({
    code: row.code,
    layer: row.layer,
    seciStage: row.seciStage,
    name: locale === "en" ? row.nameEn : row.nameAr,
    nameEn: row.nameEn,
    desc: locale === "en" && row.descEn ? row.descEn : row.descAr,
    impact: locale === "en" && row.impactEn ? row.impactEn : row.impactAr,
    example: locale === "en" && row.exampleEn ? row.exampleEn : row.exampleAr,
    roles: row.roles,
    iso: row.iso,
    efqm: row.efqm,
    national: row.national,
  }))
}

export async function listTrainingPrograms(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(trainingPrograms).orderBy(asc(trainingPrograms.sortOrder))

  return rows.map((row) => ({
    id: row.id,
    title: locale === "en" && row.titleEn ? row.titleEn : row.titleAr,
    audience: locale === "en" && row.audienceEn ? row.audienceEn : row.audienceAr,
    duration: locale === "en" && row.durationEn ? row.durationEn : row.durationAr,
    format: locale === "en" && row.formatEn ? row.formatEn : row.formatAr,
    lessons: row.lessons,
    level: locale === "en" && row.levelEn ? row.levelEn : row.levelAr,
  }))
}

export async function listComplianceMatrix(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(complianceMatrix).orderBy(asc(complianceMatrix.sortOrder))

  return Promise.all(
    rows.map(async (row) => ({
      standard: row.standard,
      scope: locale === "en" && row.scopeEn ? row.scopeEn : row.scopeAr,
      coverage: row.coverage,
      status: await getLookupLabel("compliance_status", row.statusId, locale),
    })),
  )
}

export async function listSecurityControls(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(securityControls).orderBy(asc(securityControls.sortOrder))

  return rows.map((row) => ({
    name: locale === "en" && row.nameEn ? row.nameEn : row.nameAr,
    value: locale === "en" && row.valueEn ? row.valueEn : row.valueAr,
  }))
}

export async function listMonthlyActivity(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(monthlyActivity).orderBy(asc(monthlyActivity.sortOrder))

  return rows.map((row) => ({
    month: locale === "en" && row.monthEn ? row.monthEn : row.monthAr,
    published: row.published,
    searches: row.searches,
    contributions: row.contributions,
  }))
}

export async function listTopContributors(locale: Locale = "ar") {
  const db = getDb()
  const rows = await db.select().from(topContributors).orderBy(asc(topContributors.sortOrder))

  return rows.map((row) => ({
    name: row.name,
    contributions: row.contributions,
    assets: row.assets,
    department: locale === "en" && row.departmentEn ? row.departmentEn : row.departmentAr,
  }))
}

export async function resolveCommunityDomainLabel(domainId: string, locale: Locale) {
  const domainLabel = readCachedLookupLabel("domain", domainId, locale)
  if (domainLabel) return domainLabel

  const categoryLabel = readCachedLookupLabel("category", domainId, locale)
  if (categoryLabel) return categoryLabel

  return getLookupLabel("domain", domainId, locale)
}
