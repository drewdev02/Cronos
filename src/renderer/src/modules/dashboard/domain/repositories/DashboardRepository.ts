import { DashboardStats } from '../models/DashboardStats'

export abstract class DashboardRepository {
  abstract getStats(): Promise<DashboardStats>
}
