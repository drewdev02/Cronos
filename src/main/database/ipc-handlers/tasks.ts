import { ipcMain } from 'electron'
import { getDatabase, schema } from '../index'
import { eq } from 'drizzle-orm'

export function registerTasksHandlers(): void {
  const db = getDatabase()

  ipcMain.handle('db:tasks:getAll', async () => {
    return db.select().from(schema.tasks).all()
  })

  ipcMain.handle('db:tasks:getById', async (_event, id: string) => {
    const result = db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).all()
    return result[0] ?? null
  })

  ipcMain.handle('db:tasks:create', async (_event, data: typeof schema.tasks.$inferInsert) => {
    db.insert(schema.tasks).values(data).run()
    return data
  })

  ipcMain.handle(
    'db:tasks:update',
    async (_event, id: string, data: Partial<typeof schema.tasks.$inferInsert>) => {
      db.update(schema.tasks)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.tasks.id, id))
        .run()
      const result = db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).all()
      return result[0] ?? null
    }
  )

  ipcMain.handle('db:tasks:delete', async (_event, id: string) => {
    db.delete(schema.tasks).where(eq(schema.tasks.id, id)).run()
    return true
  })
}
