/** Maps fixture display values (AR or EN) to stable translation keys under `enums.*` */

export const needStatusKey: Record<string, string> = {
  "جديد": "new",
  "New": "new",
  "قيد الإنتاج": "inProduction",
  "In production": "inProduction",
  "منشور": "published",
  "Published": "published",
}

export const needPriorityKey: Record<string, string> = {
  "عالية": "high",
  High: "high",
  "متوسطة": "medium",
  Medium: "medium",
  "منخفضة": "low",
  Low: "low",
}

export const transferStatusKey: Record<string, string> = {
  "مكتملة": "completed",
  Completed: "completed",
  "مجدولة": "scheduled",
  Scheduled: "scheduled",
  "قيد التوثيق": "documenting",
  Documenting: "documenting",
}

export const reviewStageKey: Record<string, string> = {
  "مسودة": "draft",
  Draft: "draft",
  "مراجعة": "review",
  Review: "review",
  "اعتماد": "approval",
  Approval: "approval",
  "نشر": "publish",
  Publish: "publish",
}

export const reviewPriorityKey: Record<string, string> = {
  "عالية": "high",
  High: "high",
  "متوسطة": "medium",
  Medium: "medium",
  "عادية": "normal",
  Normal: "normal",
}

export const auditResultKey: Record<string, string> = {
  "نجاح": "success",
  Success: "success",
  "فشل": "failure",
  Failure: "failure",
  "رفض": "denied",
  Denied: "denied",
}

export const complianceStatusKey: Record<string, string> = {
  "متوافق": "compliant",
  Compliant: "compliant",
  "قيد الاستكمال": "inProgress",
  "In progress": "inProgress",
}

export const outputStatusKey: Record<string, string> = {
  "معتمد": "approved",
  Approved: "approved",
  "قيد المراجعة": "underReview",
  "Under review": "underReview",
  "مسودة": "draft",
  Draft: "draft",
}

export const trainingLevelKey: Record<string, string> = {
  "تمهيدي": "beginner",
  Introductory: "beginner",
  "متوسط": "intermediate",
  Intermediate: "intermediate",
  "متقدم": "advanced",
  Advanced: "advanced",
}
