import { getDictionary, type Locale } from "@/i18n"

export type TransferSessionType = {
  id: string
  label: string
  desc: string
}

const SESSION_TYPE_KEYS = [
  { id: "project-close", key: "projectClose" },
  { id: "expert", key: "expert" },
  { id: "handover", key: "handover" },
  { id: "best-practice", key: "bestPractice" },
  { id: "lessons-learned", key: "lessonsLearned" },
] as const

type SessionTypeKey = (typeof SESSION_TYPE_KEYS)[number]["key"]

export function getTransferSessionTypes(locale: Locale): TransferSessionType[] {
  const { enums } = getDictionary(locale)
  return SESSION_TYPE_KEYS.map(({ id, key }) => {
    const entry = enums.transferSessionTypes[key as SessionTypeKey]
    return { id, label: entry.label, desc: entry.desc }
  })
}

export function getTransferSessionTypeLabels(locale: Locale): string[] {
  return getTransferSessionTypes(locale).map((t) => t.label)
}
