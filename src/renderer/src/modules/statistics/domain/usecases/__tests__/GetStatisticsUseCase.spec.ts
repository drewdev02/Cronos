import { describe, it, expect, vi } from 'vitest'
import { GetStatisticsUseCase } from '../GetStatisticsUseCase'
import { StatisticsRepository } from '../../repositories/StatisticsRepository'
import { Statistics } from '../../models/Statistics'

const mockStats: Statistics = {
  earningsByClient: [{ clientName: 'ACME', earned: 1200 }],
  timeDistribution: [{ name: 'Development', value: 60 }],
  trend: [{ day: '2026-02-01', earned: 200 }]
}

class MockRepo extends StatisticsRepository {
  getStatistics = vi.fn(async () => mockStats)
}

describe('GetStatisticsUseCase', () => {
  it('calls repository and returns statistics', async () => {
    const repo = new MockRepo()
    const usecase = new GetStatisticsUseCase(repo)

    const result = await usecase.execute()

    expect(repo.getStatistics).toHaveBeenCalled()
    expect(result).toEqual(mockStats)
  })
})
