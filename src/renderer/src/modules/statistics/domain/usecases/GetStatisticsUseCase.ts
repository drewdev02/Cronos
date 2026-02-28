import { StatisticsRepository } from '../repositories/StatisticsRepository'
import { Statistics } from '../models/Statistics'

export class GetStatisticsUseCase {
  constructor(private readonly repository: StatisticsRepository) {}

  async execute(): Promise<Statistics> {
    return this.repository.getStatistics()
  }
}
