import "dotenv/config"
import { execSync } from "node:child_process"
import { count } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { lookups, users } from "@/lib/db/schema"

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/local.db"
const isRemote =
  url.startsWith("libsql:") || url.startsWith("https:") || url.startsWith("http:")

if (!isRemote) {
  console.log("[db:seed:ci] Local SQLite detected — skipping remote seed.")
  process.exit(0)
}

if (!process.env.TURSO_AUTH_TOKEN?.trim()) {
  console.error("[db:seed:ci] TURSO_AUTH_TOKEN is required for remote seed.")
  process.exit(1)
}

async function isDatabaseEmpty() {
  const db = getDb()
  const [userCount, lookupCount] = await Promise.all([
    db.select({ value: count() }).from(users).get(),
    db.select({ value: count() }).from(lookups).get(),
  ])
  return (userCount?.value ?? 0) === 0 && (lookupCount?.value ?? 0) === 0
}

async function main() {
  const empty = await isDatabaseEmpty()

  if (!empty) {
    console.log("[db:seed:ci] Database already has data — skipping seed to preserve live records.")
    return
  }

  console.log("[db:seed:ci] Empty remote database detected — running seed…")
  execSync("npx tsx scripts/seed.ts", { stdio: "inherit" })
  console.log("[db:seed:ci] Seed complete.")
}

main().catch((error) => {
  console.error("[db:seed:ci] Seed failed:", error)
  process.exit(1)
})
