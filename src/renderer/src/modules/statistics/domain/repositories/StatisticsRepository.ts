import { Statistics } from '../models/Statistics'

export abstract class StatisticsRepository {
  abstract getStatistics(): Promise<Statistics>
}
