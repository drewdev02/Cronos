import { DashboardRepository } from '../../domain/repositories/DashboardRepository'
import { DashboardStats } from '../../domain/models/DashboardStats'

export class DashboardRepositoryImpl extends DashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const result = await window.api.dashboard.getStats()
    return result as DashboardStats
  }
}
