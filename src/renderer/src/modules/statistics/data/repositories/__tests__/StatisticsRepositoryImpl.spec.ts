import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatisticsRepositoryImpl } from '../StatisticsRepositoryImpl'
import { Statistics } from '../../../domain/models/Statistics'

const mockStats: Statistics = {
  earningsByClient: [{ clientName: 'Initech', earned: 300 }],
  timeDistribution: [{ name: 'QA', value: 10 }],
  trend: [{ day: '2026-02-03', earned: 50 }]
}


describe('StatisticsRepositoryImpl', () => {
  beforeEach(() => {
    // ensure a fresh mock on the global window.api
    ;(globalThis as any).window = (globalThis as any).window || {}
    window.api = {
      statistics: {
        getStats: vi.fn(async () => mockStats)
      }
    }
  })

  it('fetches statistics from window.api', async () => {
    const repo = new StatisticsRepositoryImpl()

    const result = await repo.getStatistics()

    expect(window.api.statistics.getStats).toHaveBeenCalled()
    expect(result).toEqual(mockStats)
  })
})
