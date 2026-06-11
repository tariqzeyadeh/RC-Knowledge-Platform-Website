import type { Dictionary } from "@/i18n"

export function getOrg(dict: Dictionary) {
  return dict.org
}

/** @deprecated Use getOrg(dict) */
export const ORG = {
  name: "مكتب شؤون المهمات والمبادرات",
  parent: "الديوان الملكي",
  platform: "منصّة إدارة المعرفة",
  city: "المدينة الرقمية – حي النخيل، الرياض 12383",
}
