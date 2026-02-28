import { ipcMain } from 'electron'
import { getDatabase, schema } from '../index'
import { eq } from 'drizzle-orm'

export function registerProjectsHandlers(): void {
  const db = getDatabase()

  ipcMain.handle('db:projects:getAll', async () => {
    return db.select().from(schema.projects).all()
  })

  ipcMain.handle('db:projects:getById', async (_event, id: string) => {
    const result = db.select().from(schema.projects).where(eq(schema.projects.id, id)).all()
    return result[0] ?? null
  })

  ipcMain.handle(
    'db:projects:create',
    async (_event, data: typeof schema.projects.$inferInsert) => {
      db.insert(schema.projects).values(data).run()
      return data
    }
  )

  ipcMain.handle(
    'db:projects:update',
    async (_event, id: string, data: Partial<typeof schema.projects.$inferInsert>) => {
      db.update(schema.projects)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.projects.id, id))
        .run()
      const result = db.select().from(schema.projects).where(eq(schema.projects.id, id)).all()
      return result[0] ?? null
    }
  )

  ipcMain.handle('db:projects:delete', async (_event, id: string) => {
    db.delete(schema.projects).where(eq(schema.projects.id, id)).run()
    return true
  })
}
