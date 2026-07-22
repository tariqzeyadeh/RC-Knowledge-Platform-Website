import * as analyticsAr from "@/data/fixtures/analytics"
import * as analyticsEn from "@/data/fixtures/locale/en/analytics"
import * as featuresAr from "@/data/fixtures/features"
import * as featuresEn from "@/data/fixtures/locale/en/features"
import * as governanceAr from "@/data/fixtures/governance"
import * as governanceEn from "@/data/fixtures/locale/en/governance"
import * as seciAr from "@/data/fixtures/seci"
import * as seciEn from "@/data/fixtures/locale/en/seci"
import { getDictionary } from "@/i18n"
import { getDb } from "@/lib/db"
import {
  auditLogEntries,
  complianceMatrix,
  governanceRoles,
  lookupTranslations,
  lookups,
  monthlyActivity,
  platformFeatures,
  seciLayers,
  securityControls,
  topContributors,
  trainingPrograms,
} from "@/lib/db/schema"

async function insertLookup(
  group: string,
  id: string,
  sortOrder: number,
  labels: { ar: string; en: string },
) {
  const db = getDb()
  await db.insert(lookups).values({ id, group, sortOrder, isActive: true })
  await db.insert(lookupTranslations).values([
    { lookupId: id, locale: "ar", label: labels.ar },
    { lookupId: id, locale: "en", label: labels.en },
  ])
}

export async function seedPlatformLookups() {
  const arEnums = getDictionary("ar").enums
  const enEnums = getDictionary("en").enums

  const auditResults = [
    { id: "ar-success", key: "success" as const },
    { id: "ar-failure", key: "failure" as const },
    { id: "ar-denied", key: "denied" as const },
  ]
  for (const [index, result] of auditResults.entries()) {
    await insertLookup("audit_result", result.id, index, {
      ar: arEnums.auditResult[result.key],
      en: enEnums.auditResult[result.key],
    })
  }

  const complianceStatuses = [
    { id: "cs-compliant", key: "compliant" as const },
    { id: "cs-in-progress", key: "inProgress" as const },
  ]
  for (const [index, status] of complianceStatuses.entries()) {
    await insertLookup("compliance_status", status.id, index, {
      ar: arEnums.complianceStatus[status.key],
      en: enEnums.complianceStatus[status.key],
    })
  }
}

const AUDIT_RESULT_MAP: Record<string, string> = {
  نجاح: "ar-success",
  فشل: "ar-failure",
  رفض: "ar-denied",
  Success: "ar-success",
  Failure: "ar-failure",
  Denied: "ar-denied",
}

const COMPLIANCE_STATUS_MAP: Record<string, string> = {
  متوافق: "cs-compliant",
  "قيد الاستكمال": "cs-in-progress",
  Compliant: "cs-compliant",
  "In progress": "cs-in-progress",
}

export async function seedPlatformData() {
  const db = getDb()

  for (const [index, role] of governanceAr.roles.entries()) {
    const enRole = governanceEn.roles[index]
    await db.insert(governanceRoles).values({
      id: role.id,
      nameAr: role.name,
      nameEn: enRole.name,
      users: role.users,
      descAr: role.desc,
      descEn: enRole.desc,
      permissions: role.permissions,
      sortOrder: index,
    })
  }

  for (const entry of governanceAr.auditLog) {
    await db.insert(auditLogEntries).values({
      id: entry.id,
      user: entry.user,
      action: entry.action,
      target: entry.target,
      time: entry.time,
      ip: entry.ip,
      resultId: AUDIT_RESULT_MAP[entry.result] ?? "ar-success",
    })
  }

  for (const [index, layer] of seciAr.seciLayers.entries()) {
    const enLayer = seciEn.seciLayers[index]
    await db.insert(seciLayers).values({
      id: layer.id,
      titleAr: layer.title,
      titleEn: enLayer.title,
      seciAr: layer.seci,
      seciEn: enLayer.seci,
      knowledgeTypeAr: layer.knowledgeType,
      knowledgeTypeEn: enLayer.knowledgeType,
      color: layer.color,
      descAr: layer.desc,
      descEn: enLayer.desc,
      sortOrder: index,
    })
  }

  for (const [index, feature] of featuresAr.features.entries()) {
    const enFeature = featuresEn.features[index]
    await db.insert(platformFeatures).values({
      code: feature.code,
      layer: feature.layer,
      seciStage: feature.seciStage,
      nameAr: feature.name,
      nameEn: enFeature.nameEn ?? enFeature.name,
      descAr: feature.desc,
      descEn: enFeature.desc,
      impactAr: feature.impact,
      impactEn: enFeature.impact,
      exampleAr: feature.example,
      exampleEn: enFeature.example,
      roles: feature.roles,
      iso: feature.iso,
      efqm: feature.efqm,
      national: feature.national,
      sortOrder: index,
    })
  }

  for (const [index, program] of analyticsAr.trainingPrograms.entries()) {
    const enProgram = analyticsEn.trainingPrograms[index]
    await db.insert(trainingPrograms).values({
      id: program.id,
      titleAr: program.title,
      titleEn: enProgram.title,
      audienceAr: program.audience,
      audienceEn: enProgram.audience,
      durationAr: program.duration,
      durationEn: enProgram.duration,
      formatAr: program.format,
      formatEn: enProgram.format,
      lessons: program.lessons,
      levelAr: program.level,
      levelEn: enProgram.level,
      sortOrder: index,
    })
  }

  for (const [index, row] of analyticsAr.complianceMatrix.entries()) {
    const enRow = analyticsEn.complianceMatrix[index]
    await db.insert(complianceMatrix).values({
      standard: row.standard,
      scopeAr: row.scope,
      scopeEn: enRow.scope,
      coverage: row.coverage,
      statusId: COMPLIANCE_STATUS_MAP[row.status] ?? "cs-compliant",
      sortOrder: index,
    })
  }

  for (const [index, control] of analyticsAr.securityControls.entries()) {
    const enControl = analyticsEn.securityControls[index]
    await db.insert(securityControls).values({
      nameAr: control.name,
      nameEn: enControl.name,
      valueAr: control.value,
      valueEn: enControl.value,
      sortOrder: index,
    })
  }

  for (const [index, month] of analyticsAr.monthlyActivity.entries()) {
    const enMonth = analyticsEn.monthlyActivity[index]
    await db.insert(monthlyActivity).values({
      monthAr: month.month,
      monthEn: enMonth.month,
      published: month.published,
      searches: month.searches,
      contributions: month.contributions,
      sortOrder: index,
    })
  }

  for (const [index, contributor] of analyticsAr.topContributors.entries()) {
    const enContributor = analyticsEn.topContributors[index]
    await db.insert(topContributors).values({
      name: contributor.name,
      contributions: contributor.contributions,
      assets: contributor.assets,
      departmentAr: contributor.department,
      departmentEn: enContributor.department,
      sortOrder: index,
    })
  }
}

export async function clearPlatformTables() {
  const db = getDb()
  await db.delete(topContributors)
  await db.delete(monthlyActivity)
  await db.delete(securityControls)
  await db.delete(complianceMatrix)
  await db.delete(trainingPrograms)
  await db.delete(platformFeatures)
  await db.delete(seciLayers)
  await db.delete(auditLogEntries)
  await db.delete(governanceRoles)
}
