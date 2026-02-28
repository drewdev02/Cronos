import { describe, it, expect, vi } from 'vitest'
import { GetDashboardStatsUseCase } from '../GetDashboardStatsUseCase'
import { DashboardRepository } from '@/modules/dashboard/domain/repositories/DashboardRepository'
import { DashboardStats } from '@/modules/dashboard/domain/models/DashboardStats'

describe('GetDashboardStatsUseCase', () => {
  it('returns stats from repository', async () => {
    const stats: DashboardStats = { totalEarned: 100, totalTime: '01:00:00', activeProjects: 2 }
    const repo: Partial<DashboardRepository> = { getStats: vi.fn().mockResolvedValue(stats) }

    const uc = new GetDashboardStatsUseCase(repo as DashboardRepository)
    const result = await uc.execute()
    expect(repo.getStats).toHaveBeenCalled()
    expect(result).toBe(stats)
  })
})
