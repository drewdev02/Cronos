import { makeAutoObservable, runInAction } from 'mobx'
import { GetDashboardStatsUseCase } from '../../domain/usecases/GetDashboardStatsUseCase'
import { DashboardStats } from '../../domain/models/DashboardStats'

export class DashboardViewModel {
  stats: DashboardStats | null = null
  loading = false

  constructor(private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase) {
    makeAutoObservable(this)
  }

  async loadStats() {
    this.loading = true
    try {
      const result = await this.getDashboardStatsUseCase.execute()
      runInAction(() => {
        this.stats = result
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
