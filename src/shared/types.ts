export interface ClientDTO {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface ClientLiteDTO {
  id: string
  name: string
}

export interface ProjectDTO {
  id: string
  name: string
  clientId: string | null
  color: string | null
  client?: ClientLiteDTO | null
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

export interface EarningsByClientDTO {
  clientName: string
  earned: number
}

export interface TimeDistributionEntryDTO {
  name: string
  value: number
}

export interface TrendEntryDTO {
  day: string
  earned: number
}

export interface StatisticsDTO {
  earningsByClient: EarningsByClientDTO[]
  timeDistribution: TimeDistributionEntryDTO[]
  trend: TrendEntryDTO[]
}
