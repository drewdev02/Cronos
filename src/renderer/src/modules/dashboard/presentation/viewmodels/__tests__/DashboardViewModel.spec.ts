import { describe, it, expect, vi } from 'vitest'
import { DashboardViewModel } from '../DashboardViewModel'
import { GetDashboardStatsUseCase } from '@/modules/dashboard/domain/usecases/GetDashboardStatsUseCase'
import { DashboardStats } from '@/modules/dashboard/domain/models/DashboardStats'

describe('DashboardViewModel', () => {
  it('sets loading true while loading stats then false and populates stats', async () => {
    const stats: DashboardStats = { totalEarned: 200, totalTime: '02:00:00', activeProjects: 3 }
    const mockGet = { execute: vi.fn().mockResolvedValue(stats) } as unknown as GetDashboardStatsUseCase

    const vm = new DashboardViewModel(mockGet)
    const promise = vm.loadStats()
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.stats).not.toBeNull()
    expect(vm.stats?.totalEarned).toBe(200)
  })
})
