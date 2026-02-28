import { ipcMain } from 'electron'
import { getDatabase, schema } from '../index'
import { eq } from 'drizzle-orm'

export function registerProjectsHandlers(): void {
  const db = getDatabase()
  ipcMain.handle('db:projects:getAll', async () => {
    const rows = db
      .select({
        id: schema.projects.id,
        name: schema.projects.name,
        clientId: schema.projects.clientId,
        color: schema.projects.color,
        rate: schema.projects.rate,
        createdAt: schema.projects.createdAt,
        updatedAt: schema.projects.updatedAt,
        client_id: schema.clients.id,
        client_name: schema.clients.name
      })
      .from(schema.projects)
      .leftJoin(schema.clients, eq(schema.clients.id, schema.projects.clientId))
      .all()

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      clientId: r.clientId ?? null,
      color: r.color ?? null,
      rate: r.rate ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      client: r.client_id ? { id: r.client_id, name: r.client_name } : null
    }))
  })

  ipcMain.handle('db:projects:getById', async (_event, id: string) => {
    const rows = db
      .select({
        id: schema.projects.id,
        name: schema.projects.name,
        clientId: schema.projects.clientId,
        color: schema.projects.color,
        rate: schema.projects.rate,
        createdAt: schema.projects.createdAt,
        updatedAt: schema.projects.updatedAt,
        client_id: schema.clients.id,
        client_name: schema.clients.name
      })
      .from(schema.projects)
      .leftJoin(schema.clients, eq(schema.clients.id, schema.projects.clientId))
      .where(eq(schema.projects.id, id))
      .all()

    const r = rows[0]
    if (!r) return null
    return {
      id: r.id,
      name: r.name,
      clientId: r.clientId ?? null,
      color: r.color ?? null,
      rate: r.rate ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      client: r.client_id ? { id: r.client_id, name: r.client_name } : null
    }
  })

  ipcMain.handle(
    'db:projects:create',
    async (_event, data: typeof schema.projects.$inferInsert) => {
      db.insert(schema.projects).values(data).run()
      const rows = db
        .select({
          id: schema.projects.id,
          name: schema.projects.name,
          clientId: schema.projects.clientId,
          color: schema.projects.color,
          rate: schema.projects.rate,
          createdAt: schema.projects.createdAt,
          updatedAt: schema.projects.updatedAt,
          client_id: schema.clients.id,
          client_name: schema.clients.name
        })
        .from(schema.projects)
        .leftJoin(schema.clients, eq(schema.clients.id, schema.projects.clientId))
        .where(eq(schema.projects.id, data.id))
        .all()

      const r = rows[0]
      return r
        ? {
            id: r.id,
            name: r.name,
            clientId: r.clientId ?? null,
            color: r.color ?? null,
            rate: r.rate ?? null,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            client: r.client_id ? { id: r.client_id, name: r.client_name } : null
          }
        : data
    }
  )

  ipcMain.handle(
    'db:projects:update',
    async (_event, id: string, data: Partial<typeof schema.projects.$inferInsert>) => {
      db.update(schema.projects)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(schema.projects.id, id))
        .run()
      const rows = db
        .select({
          id: schema.projects.id,
          name: schema.projects.name,
          clientId: schema.projects.clientId,
          color: schema.projects.color,
          rate: schema.projects.rate,
          createdAt: schema.projects.createdAt,
          updatedAt: schema.projects.updatedAt,
          client_id: schema.clients.id,
          client_name: schema.clients.name
        })
        .from(schema.projects)
        .leftJoin(schema.clients, eq(schema.clients.id, schema.projects.clientId))
        .where(eq(schema.projects.id, id))
        .all()

      const r = rows[0]
      return r
        ? {
            id: r.id,
            name: r.name,
            clientId: r.clientId ?? null,
            color: r.color ?? null,
            rate: r.rate ?? null,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            client: r.client_id ? { id: r.client_id, name: r.client_name } : null
          }
        : null
    }
  )

  ipcMain.handle('db:projects:delete', async (_event, id: string) => {
    db.delete(schema.projects).where(eq(schema.projects.id, id)).run()
    return true
  })
}
