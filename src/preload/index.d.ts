import { ElectronAPI } from '@electron-toolkit/preload'
import { ClientDTO, ProjectDTO, TaskDTO, DashboardStatsDTO, StatisticsDTO } from '../shared/types'

interface CrudAPI<T> {
  getAll: () => Promise<T[]>
  getById: (id: string) => Promise<T | null>
  create: (data: T) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  delete: (id: string) => Promise<boolean>
}
interface CrudApiExtend<T> extends CrudAPI<T> {
  getLite: () => Promise<{ id: string; name: string }[]>
}

interface DashboardAPI {
  getStats: () => Promise<DashboardStatsDTO>
}

interface MessageDTO {
  id: string
  content: string
  sender: 'user' | 'ia'
  createdAt: string
}

interface MessagesAPI {
  getAll: () => Promise<MessageDTO[]>
  create: (data: { content: string; sender: 'user' | 'ia' }) => Promise<MessageDTO>
}

interface DatabaseAPI {
  clients: CrudApiExtend<ClientDTO>
  projects: CrudAPI<ProjectDTO>
  tasks: CrudAPI<TaskDTO>
  dashboard: DashboardAPI
  statistics: {
    getStats: () => Promise<StatisticsDTO>
  }
  messages: MessagesAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: DatabaseAPI & { chat: { sendMessage: (content: string) => Promise<{ ia: MessageDTO }> } }
  }
}
