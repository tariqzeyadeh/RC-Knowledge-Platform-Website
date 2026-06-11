import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const pageRoutes = [
  { app: "app/page.tsx", out: "PageViews/home/home-page.tsx", name: "HomePage" },
  { app: "app/search/page.tsx", out: "PageViews/search/search-page.tsx", name: "SearchPage" },
  { app: "app/library/page.tsx", out: "PageViews/library/library-page.tsx", name: "LibraryPage" },
  { app: "app/upload/page.tsx", out: "PageViews/upload/upload-page.tsx", name: "UploadPage" },
  { app: "app/communities/page.tsx", out: "PageViews/communities/communities-page.tsx", name: "CommunitiesPage" },
  { app: "app/transfer/page.tsx", out: "PageViews/transfer/transfer-page.tsx", name: "TransferPage" },
  { app: "app/needs/page.tsx", out: "PageViews/needs/needs-page.tsx", name: "NeedsPage" },
  { app: "app/review/page.tsx", out: "PageViews/review/review-page.tsx", name: "ReviewPage" },
  { app: "app/analytics/page.tsx", out: "PageViews/analytics/analytics-page.tsx", name: "AnalyticsPage" },
  { app: "app/admin/roles/page.tsx", out: "PageViews/admin/roles-page.tsx", name: "RolesPage" },
  { app: "app/admin/audit/page.tsx", out: "PageViews/admin/audit-page.tsx", name: "AuditPage" },
  { app: "app/governance/page.tsx", out: "PageViews/governance/governance-page.tsx", name: "GovernancePage" },
  { app: "app/training/page.tsx", out: "PageViews/training/training-page.tsx", name: "TrainingPage" },
  { app: "app/features/page.tsx", out: "PageViews/features/features-page.tsx", name: "FeaturesPage" },
  { app: "app/notifications/page.tsx", out: "PageViews/notifications/notifications-page.tsx", name: "NotificationsPage" },
  { app: "app/knowledge/[id]/page.tsx", out: "PageViews/knowledge/knowledge-detail-page.tsx", name: "KnowledgeDetailPage" },
]

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.join(root, filePath)), { recursive: true })
}

function gitShow(file) {
  return execSync(`git show HEAD:${file.replace(/\\/g, "/")}`, { cwd: root, encoding: "utf8" })
}

function replaceImports(content) {
  return content
    .replace(/@\/components\/app-shell/g, "@/components/layout/app-shell")
    .replace(/@\/lib\/utils/g, "@/utils")
}

for (const route of pageRoutes) {
  let content = gitShow(route.app)
  content = replaceImports(content)
  content = content.replace(/export default async function (\w+)/, "export async function $1")
  content = content.replace(/export default function (\w+)/, "export function $1")

  ensureDir(route.out)
  fs.writeFileSync(path.join(root, route.out), content)

  const importPath = `@/pages/${route.out.replace(/^PageViews\//, "").replace(/\\/g, "/").replace(/\.tsx$/, "")}`
  const wrapper =
    route.app.includes("[id]")
      ? `export { ${route.name} as default, generateStaticParams } from "${importPath}"\n`
      : `export { ${route.name} as default } from "${importPath}"\n`

  fs.writeFileSync(path.join(root, route.app), wrapper)
  console.log("restored", route.out)
}

console.log("done")
