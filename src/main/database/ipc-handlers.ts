import { ipcMain } from 'electron'
import { getDatabase, schema } from './index'
import { eq } from 'drizzle-orm'

export function registerDatabaseHandlers(): void {
  const db = getDatabase()

  // ── Clients ────────────────────────────────────────────────────────
  ipcMain.handle('db:clients:getAll', async () => {
    return db.select().from(schema.clients).all()
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

  // ── Projects ───────────────────────────────────────────────────────
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

  // ── Tasks ──────────────────────────────────────────────────────────
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

  // ── Dashboard Stats ────────────────────────────────────────────────
  ipcMain.handle('db:dashboard:getStats', async () => {
    const totalProjects = db.select().from(schema.projects).all().length
    const allTasks = db.select().from(schema.tasks).all()

    const totalDuration = allTasks.reduce((acc, task) => acc + (task.duration ?? 0), 0)
    const hours = Math.floor(totalDuration / 3600)
    const minutes = Math.floor((totalDuration % 3600) / 60)
    const seconds = Math.floor(totalDuration % 60)
    const totalTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    return {
      totalEarned: 0,
      totalTime,
      activeProjects: totalProjects
    }
  })
}
