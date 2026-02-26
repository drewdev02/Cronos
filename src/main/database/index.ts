import { app } from 'electron'
import { join } from 'path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'

let db: ReturnType<typeof drizzle<typeof schema>> | null = null
let sqlite: Database.Database | null = null

export function getDatabase(): ReturnType<typeof drizzle<typeof schema>> {
  if (db) return db

  const dbPath = join(app.getPath('userData'), 'cronos.db')

  sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  db = drizzle(sqlite, { schema })

  return db
}

export function runMigrations(): void {
  const database = getDatabase()
  // In dev mode __dirname is "out/main", so "../../drizzle" resolves to project root.
  // In production the drizzle folder is packed alongside the app resources.
  const migrationsFolder = app.isPackaged
    ? join(process.resourcesPath, 'drizzle')
    : join(__dirname, '../../drizzle')
  migrate(database, { migrationsFolder })
}

export function closeDatabase(): void {
  if (sqlite) {
    sqlite.close()
    sqlite = null
    db = null
  }
}

export { schema }
