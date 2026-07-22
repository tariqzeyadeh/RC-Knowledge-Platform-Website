import "dotenv/config"
import { defineConfig } from "drizzle-kit"

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/local.db"
const isRemote = url.startsWith("libsql:") || url.startsWith("https:")

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: isRemote ? "turso" : "sqlite",
  dbCredentials: isRemote
    ? { url, authToken: process.env.TURSO_AUTH_TOKEN! }
    : { url },
})
