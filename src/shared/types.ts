export interface ClientDTO {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface ProjectDTO {
  id: string
  name: string
  clientId: string | null
  color: string | null
  rate: number | null
  createdAt: string
  updatedAt: string
}

export interface TaskDTO {
  id: string
  title: string
  projectId: string | null
  duration: number
  startTime: string | null
  endTime: string | null
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface DashboardStatsDTO {
  totalEarned: number
  totalTime: string
  activeProjects: number
}
