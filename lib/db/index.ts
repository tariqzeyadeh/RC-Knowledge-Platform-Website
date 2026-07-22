import { createClient, type Client } from "@libsql/client"
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql"
import { getDatabaseConfig } from "@/lib/db/env"
import * as schema from "@/lib/db/schema"

type Db = LibSQLDatabase<typeof schema>

let client: Client | undefined
let database: Db | undefined

function createDbClient() {
  const { url, authToken } = getDatabaseConfig()
  return createClient(authToken ? { url, authToken } : { url })
}

export function getDb(): Db {
  if (!database) {
    client = createDbClient()
    database = drizzle(client, { schema })
  }
  return database
}

export { schema }
