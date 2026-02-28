import { ipcMain } from 'electron'
import { getDatabase, schema } from '../index'
import { eq } from 'drizzle-orm'

export function registerClientsHandlers(): void {
  const db = getDatabase()

  ipcMain.handle('db:clients:getAll', async () => {
    return db.select().from(schema.clients).all()
  })

  ipcMain.handle('db:clients:getLite', async () => {
    return db
      .select({ id: schema.clients.id, name: schema.clients.name })
      .from(schema.clients)
      .all()
  })

  ipcMain.handle('db:clients:getById', async (_event, id: string) => {
    const result = db.select().from(schema.clients).where(eq(schema.clients.id, id)).all()
    return result[0] ?? null
  })

  ipcMain.handle('db:clients:create', async (_event, data: typeof schema.clients.$inferInsert) => {
    db.insert(schema.clients).values(data).run()
    return data
  })

  ipcMain.handle(
    'db:clients:update',
    async (_event, id: string, data: Partial<typeof schema.clients.$inferInsert>) => {
      db.update(schema.clients)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.clients.id, id))
        .run()
      const result = db.select().from(schema.clients).where(eq(schema.clients.id, id)).all()
      return result[0] ?? null
    }
  )

  ipcMain.handle('db:clients:delete', async (_event, id: string) => {
    db.delete(schema.clients).where(eq(schema.clients.id, id)).run()
    return true
  })
}
