import { StatisticsRepository } from '../../domain/repositories/StatisticsRepository'
import { Statistics } from '../../domain/models/Statistics'

// Aggregates data from window.api (tasks, projects, clients) and computes simple stats
export class StatisticsRepositoryImpl extends StatisticsRepository {
  async getStatistics(): Promise<Statistics> {
    const result = await window.api.statistics.getStats()
    return result as Statistics
  }
}
