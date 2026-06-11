import type { Dictionary } from "@/i18n"

const confidentialityCls: Record<string, string> = {
  public: "bg-emerald-50 text-emerald-700 border-emerald-200",
  internal: "bg-sky-50 text-sky-700 border-sky-200",
  confidential: "bg-amber-50 text-amber-700 border-amber-200",
  strict: "bg-red-50 text-red-700 border-red-200",
}

const statusCls: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  draft: "bg-muted text-muted-foreground border-border",
}

export function getConfidentialityMap(dict: Dictionary) {
  return {
    public: { name: dict.presentation.confidentiality.public, cls: confidentialityCls.public },
    internal: { name: dict.presentation.confidentiality.internal, cls: confidentialityCls.internal },
    confidential: { name: dict.presentation.confidentiality.confidential, cls: confidentialityCls.confidential },
    strict: { name: dict.presentation.confidentiality.strict, cls: confidentialityCls.strict },
  }
}

export function getStatusMap(dict: Dictionary) {
  return {
    published: { name: dict.presentation.status.published, cls: statusCls.published },
    review: { name: dict.presentation.status.review, cls: statusCls.review },
    draft: { name: dict.presentation.status.draft, cls: statusCls.draft },
  }
}

/** @deprecated Use getConfidentialityMap(dict) */
export const confidentialityMap = {
  public: { name: "عام", cls: confidentialityCls.public },
  internal: { name: "داخلي", cls: confidentialityCls.internal },
  confidential: { name: "سري", cls: confidentialityCls.confidential },
  strict: { name: "سري للغاية", cls: confidentialityCls.strict },
}

/** @deprecated Use getStatusMap(dict) */
export const statusMap = {
  published: { name: "منشور", cls: statusCls.published },
  review: { name: "قيد المراجعة", cls: statusCls.review },
  draft: { name: "مسودة", cls: statusCls.draft },
}
