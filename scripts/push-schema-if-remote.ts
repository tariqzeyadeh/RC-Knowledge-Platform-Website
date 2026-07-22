import "dotenv/config"
import { execSync } from "node:child_process"

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/local.db"
const isRemote =
  url.startsWith("libsql:") || url.startsWith("https:") || url.startsWith("http:")

if (!isRemote) {
  console.log("[db:push:ci] Local SQLite detected — skipping remote schema push.")
  process.exit(0)
}

if (!process.env.TURSO_AUTH_TOKEN?.trim()) {
  console.error("[db:push:ci] TURSO_AUTH_TOKEN is required for remote schema push.")
  process.exit(1)
}

console.log("[db:push:ci] Applying schema to remote database…")
execSync("npx drizzle-kit push --force", { stdio: "inherit" })
console.log("[db:push:ci] Schema push complete.")
