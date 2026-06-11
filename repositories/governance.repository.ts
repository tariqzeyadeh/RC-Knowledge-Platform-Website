import { localizedData } from "@/data/localized"
import type { Locale } from "@/i18n"

/** Data access — governance, RBAC, audit (F-21–F-25, F-28–F-29) */
export const governanceRepository = {
  listAuditLog(locale: Locale = "ar") {
    return localizedData.governance(locale).auditLog
  },

  listRoles(locale: Locale = "ar") {
    return localizedData.governance(locale).roles
  },

  listComplianceMatrix(locale: Locale = "ar") {
    return localizedData.analytics(locale).complianceMatrix
  },

  listSecurityControls(locale: Locale = "ar") {
    return localizedData.analytics(locale).securityControls
  },

  listTrainingPrograms(locale: Locale = "ar") {
    return localizedData.analytics(locale).trainingPrograms
  },
}
