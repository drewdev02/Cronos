import { ipcMain } from 'electron'
import { getDatabase, schema } from '../index'
import { eq, sql } from 'drizzle-orm'

export function registerDashboardHandlers(): void {
  const db = getDatabase()

  ipcMain.handle('db:dashboard:getStats', async () => {
    const rows = await db
      .select({
        totalProjects: sql<number>`(SELECT COUNT(*) FROM ${schema.projects})`,
        totalDuration: sql<number>`COALESCE(SUM(${schema.tasks.duration}), 0)`,
        totalEarned: sql<number>`COALESCE(SUM((${schema.tasks.duration} / 3600.0) * COALESCE(${schema.projects.rate}, 0)), 0)`
      })
      .from(schema.tasks)
      .leftJoin(schema.projects, eq(schema.tasks.projectId, schema.projects.id))
      .all()

    const row = rows[0] ?? { totalProjects: 0, totalDuration: 0, totalEarned: 0 }

    const totalDuration = Number(row.totalDuration) || 0
    const totalEarned = Number(row.totalEarned) || 0

    const hours = Math.floor(totalDuration / 3600)
    const minutes = Math.floor((totalDuration % 3600) / 60)
    const seconds = Math.floor(totalDuration % 60)
    const totalTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    return {
      totalEarned,
      totalTime,
      activeProjects: Number(row.totalProjects) || 0
    }
  })
}
