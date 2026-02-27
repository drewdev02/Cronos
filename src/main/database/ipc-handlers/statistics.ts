import { ipcMain } from 'electron'
import { getDatabase, schema } from '../index'
import { eq, sql } from 'drizzle-orm'
import { weekdayShortFromString } from '../../lib/dateUtils'

export function registerStatisticsHandlers(): void {
  const db = getDatabase()

  ipcMain.handle('db:statistics:getStats', async () => {
    const nowLog = new Date()
    console.log('[stats] getStats called at', nowLog.toISOString())

    const earningsRows = await db
      .select({
        clientId: schema.clients.id,
        clientName: schema.clients.name,
        earned: sql`
          SUM((COALESCE(${schema.tasks.duration}, 0) / 3600.0) * COALESCE(${schema.projects.rate}, 0))
        `
      })
      .from(schema.tasks)
      .leftJoin(schema.projects, eq(schema.tasks.projectId, schema.projects.id))
      .leftJoin(schema.clients, eq(schema.projects.clientId, schema.clients.id))
      .groupBy(schema.clients.id)
      .all()

    const timeRows = await db
      .select({
        projectId: schema.projects.id,
        projectName: schema.projects.name,
        value: sql`SUM(COALESCE(${schema.tasks.duration}, 0))`
      })
      .from(schema.tasks)
      .leftJoin(schema.projects, eq(schema.tasks.projectId, schema.projects.id))
      .groupBy(schema.projects.id)
      .all()

    const now = new Date()
    const endDate = now.toISOString().slice(0, 10)
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    const startDate = start.toISOString().slice(0, 10)

    console.log('[stats] date range', { startDate, endDate })

    // Use startTime when available, otherwise fall back to createdAt so tasks
    // without a startTime are still included in the trend calculation.
    // Use startTime when available, otherwise fall back to createdAt so tasks
    // without a startTime are still included in the trend calculation.
    const trendRows = await db
      .select({
        day: sql`date(COALESCE(${schema.tasks.startTime}, ${schema.tasks.createdAt}))`,
        earned: sql`
          SUM((COALESCE(${schema.tasks.duration}, 0) / 3600.0) * COALESCE(${schema.projects.rate}, 0))
        `
      })
      .from(schema.tasks)
      .leftJoin(schema.projects, eq(schema.tasks.projectId, schema.projects.id))
      .where(sql`date(COALESCE(${schema.tasks.startTime}, ${schema.tasks.createdAt})) BETWEEN ${startDate} AND ${endDate}`)
      .groupBy(sql`date(COALESCE(${schema.tasks.startTime}, ${schema.tasks.createdAt}))`)
      .all()

    const earningsByClient = earningsRows.map((r) => ({
      clientName: (r.clientName as string) || 'Unknown',
      earned: Number((r as any).earned) || 0
    }))

    const timeDistribution = timeRows.map((r) => ({
      name: (r.projectName as string) || 'Unknown',
      value: Number((r as any).value) || 0
    }))

    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      days.push(d.toISOString().slice(0, 10))
    }

    const trendMap: Record<string, number> = {}
    for (const row of trendRows) {
      const key = String((row as any).day)
      trendMap[key] = Number((row as any).earned) || 0
    }

    const trend = days.map((k) => {
      const dayName = weekdayShortFromString(k)
      const entry = { day: dayName, earned: trendMap[k] ?? 0 }
      return entry
    })


    return {
      earningsByClient,
      timeDistribution,
      trend
    }
  })
}
