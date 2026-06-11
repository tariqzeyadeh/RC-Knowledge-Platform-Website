import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const dirs = [
  "types",
  "config",
  "data/fixtures",
  "repositories",
  "services/knowledge",
  "hooks",
  "components/layout",
]
for (const d of dirs) fs.mkdirSync(path.join(root, d), { recursive: true })

const src = fs.readFileSync(path.join(root, "lib/data.ts"), "utf8")

let typesContent = `// Domain types — SECI lifecycle and platform modules (ISO 30401 / F-01–F-30)\n\n`
const typeRegex = /export type (\w+)[\s\S]*?\n\}/g
let m
while ((m = typeRegex.exec(src)) !== null) {
  typesContent += m[0] + "\n\n"
}
typesContent += `export type ConfidentialityLevel = KnowledgeAsset["confidentiality"]\n`
typesContent += `export type AssetStatus = KnowledgeAsset["status"]\n`
typesContent += `export type AssetSort = "relevance" | "recent" | "popular"\n\n`
typesContent += `export type AssetFilters = {\n  query?: string\n  categoryId?: string\n  type?: string\n  confidentiality?: string\n}\n`
fs.writeFileSync(path.join(root, "types/domain.ts"), typesContent)

function extractBetween(startMarker, endMarker) {
  const start = src.indexOf(startMarker)
  if (start === -1) return ""
  const end = endMarker ? src.indexOf(endMarker, start + 1) : src.length
  return src.slice(start, end === -1 ? src.length : end)
}

fs.writeFileSync(
  path.join(root, "config/org.ts"),
  extractBetween("export const ORG", "/* ─────────────── نموذج SECI"),
)
fs.writeFileSync(
  path.join(root, "data/fixtures/seci.ts"),
  'import type { SeciLayer } from "@/types/domain"\n\n' +
    extractBetween("export const seciLayers", "/* ─────────────── الميزات"),
)
fs.writeFileSync(
  path.join(root, "data/fixtures/features.ts"),
  'import type { Feature } from "@/types/domain"\n\n' +
    extractBetween("export const features", "/* ─────────────── تصنيفات"),
)
fs.writeFileSync(
  path.join(root, "data/fixtures/knowledge.ts"),
  'import type { Category, KnowledgeAsset } from "@/types/domain"\n\n' +
    extractBetween("export const categories", "/* ─────────────── مجتمعات"),
)
fs.writeFileSync(
  path.join(root, "data/fixtures/collaboration.ts"),
  'import type { Community, TransferSession, ReviewItem, KnowledgeNeed, Notification } from "@/types/domain"\n\n' +
    extractBetween("export const communities", "/* ─────────────── سجل التدقيق"),
)
fs.writeFileSync(
  path.join(root, "data/fixtures/governance.ts"),
  'import type { AuditEntry, Role } from "@/types/domain"\n\n' +
    extractBetween("export const auditLog", "/* ─────────────── مؤشرات"),
)
fs.writeFileSync(
  path.join(root, "data/fixtures/analytics.ts"),
  extractBetween("export const kpis", "export function getAsset"),
)
fs.writeFileSync(
  path.join(root, "config/presentation.ts"),
  extractBetween("export const confidentialityMap", "export function getAsset") + "\n",
)

console.log("split-data: ok")
