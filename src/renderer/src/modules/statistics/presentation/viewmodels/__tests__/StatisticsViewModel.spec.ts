import { describe, it, expect, vi } from 'vitest'
import { StatisticsViewModel } from '../StatisticsViewModel'
import { GetStatisticsUseCase } from '../../../domain/usecases/GetStatisticsUseCase'
import { Statistics } from '../../../domain/models/Statistics'

const mockStats: Statistics = {
  earningsByClient: [{ clientName: 'Globex', earned: 500 }],
  timeDistribution: [{ name: 'Design', value: 30 }],
  trend: [{ day: '2026-02-02', earned: 100 }]
}

class MockUseCase implements Partial<GetStatisticsUseCase> {
  execute = vi.fn(async () => mockStats)
}

describe('StatisticsViewModel', () => {
  it('loads statistics and updates state', async () => {
    const mockUseCase = new MockUseCase() as unknown as GetStatisticsUseCase
    const vm = new StatisticsViewModel(mockUseCase)

    expect(vm.loading).toBe(false)
    expect(vm.stats).toBeNull()

    await vm.load()

    expect(mockUseCase.execute).toHaveBeenCalled()
    expect(vm.stats).toEqual(mockStats)
    expect(vm.loading).toBe(false)
  })
})
