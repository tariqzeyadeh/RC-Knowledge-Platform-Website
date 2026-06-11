import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const pageRoutes = [
  { app: "app/page.tsx", out: "pages/_views/home/home-page.tsx", name: "HomePage" },
  { app: "app/search/page.tsx", out: "pages/_views/search/search-page.tsx", name: "SearchPage" },
  { app: "app/library/page.tsx", out: "pages/_views/library/library-page.tsx", name: "LibraryPage" },
  { app: "app/upload/page.tsx", out: "pages/_views/upload/upload-page.tsx", name: "UploadPage" },
  { app: "app/communities/page.tsx", out: "pages/_views/communities/communities-page.tsx", name: "CommunitiesPage" },
  { app: "app/transfer/page.tsx", out: "pages/_views/transfer/transfer-page.tsx", name: "TransferPage" },
  { app: "app/needs/page.tsx", out: "pages/_views/needs/needs-page.tsx", name: "NeedsPage" },
  { app: "app/review/page.tsx", out: "pages/_views/review/review-page.tsx", name: "ReviewPage" },
  { app: "app/analytics/page.tsx", out: "pages/_views/analytics/analytics-page.tsx", name: "AnalyticsPage" },
  { app: "app/admin/roles/page.tsx", out: "pages/_views/admin/roles-page.tsx", name: "RolesPage" },
  { app: "app/admin/audit/page.tsx", out: "pages/_views/admin/audit-page.tsx", name: "AuditPage" },
  { app: "app/governance/page.tsx", out: "pages/_views/governance/governance-page.tsx", name: "GovernancePage" },
  { app: "app/training/page.tsx", out: "pages/_views/training/training-page.tsx", name: "TrainingPage" },
  { app: "app/features/page.tsx", out: "pages/_views/features/features-page.tsx", name: "FeaturesPage" },
  { app: "app/notifications/page.tsx", out: "pages/_views/notifications/notifications-page.tsx", name: "NotificationsPage" },
  { app: "app/knowledge/[id]/page.tsx", out: "pages/_views/knowledge/knowledge-detail-page.tsx", name: "KnowledgeDetailPage" },
]

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.join(root, filePath)), { recursive: true })
}

function replaceImports(content) {
  return content
    .replace(/@\/components\/app-shell/g, "@/components/layout/app-shell")
    .replace(/@\/lib\/utils/g, "@/utils")
}

for (const route of pageRoutes) {
  const srcPath = path.join(root, route.app)
  if (!fs.existsSync(srcPath)) {
    console.warn("skip missing", route.app)
    continue
  }

  let content = fs.readFileSync(srcPath, "utf8")
  if (content.startsWith("export {")) {
    content = fs.readFileSync(path.join(root, route.out), "utf8")
  } else {
    content = replaceImports(content)
    content = content.replace(/export default async function (\w+)/, "export async function $1")
    content = content.replace(/export default function (\w+)/, "export function $1")
  }

  ensureDir(route.out)
  fs.writeFileSync(path.join(root, route.out), content)

  const importPath = `@/${route.out.replace(/\\/g, "/").replace(/\.tsx$/, "")}`
  const wrapper =
    route.app.includes("[id]")
      ? `export { ${route.name} as default, generateStaticParams } from "${importPath}"\n`
      : `export { ${route.name} as default } from "${importPath}"\n`

  fs.writeFileSync(srcPath, wrapper)
  console.log("page", route.app, "->", route.out)
}

console.log("done")
