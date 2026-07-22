export function getDatabaseConfig() {
  const url = process.env.TURSO_DATABASE_URL ?? "file:./data/local.db"
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined
  const isVercel = Boolean(process.env.VERCEL)
  const isRemote =
    url.startsWith("libsql:") || url.startsWith("https:") || url.startsWith("http:")

  if (isVercel && !isRemote) {
    throw new Error(
      "TURSO_DATABASE_URL must be a remote libSQL URL on Vercel (e.g. libsql://your-db.turso.io).",
    )
  }

  if (isRemote && !authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required when using a remote libSQL database.")
  }

  return { url, authToken }
}
