import { ElectronAPI } from '@electron-toolkit/preload'
import { ClientDTO, ProjectDTO, TaskDTO, DashboardStatsDTO, StatisticsDTO } from '../shared/types'

interface CrudAPI<T> {
  getAll: () => Promise<T[]>
  getById: (id: string) => Promise<T | null>
  create: (data: T) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<boolean>
}

interface DashboardAPI {
  getStats: () => Promise<DashboardStatsDTO>
}

interface DatabaseAPI {
  clients: CrudAPI<ClientDTO>
  projects: CrudAPI<ProjectDTO>
  tasks: CrudAPI<TaskDTO>
  dashboard: DashboardAPI
  statistics: {
    getStats: () => Promise<StatisticsDTO>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: DatabaseAPI
  }
}
