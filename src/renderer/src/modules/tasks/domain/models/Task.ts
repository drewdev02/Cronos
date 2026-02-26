export interface Task {
  id: string
  title: string
  projectId?: string
  duration: number
  startTime?: Date
  endTime?: Date
  status: 'pending' | 'in_progress' | 'completed'
  currentDuration?: number
}
