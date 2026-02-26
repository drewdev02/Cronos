import { DashboardRepository } from '../repositories/DashboardRepository'
import { DashboardStats } from '../models/DashboardStats'

export class GetDashboardStatsUseCase {
  constructor(private readonly repository: DashboardRepository) {}

  async execute(): Promise<DashboardStats> {
    return this.repository.getStats()
  }
}
