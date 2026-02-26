import { Task } from '../models/Task'
import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository'

export interface TaskEarnings {
  earnings: number
  rate: number
}

export class CalculateTaskEarningsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(task: Task): Promise<TaskEarnings> {
    if (!task.projectId) return { earnings: 0, rate: 0 }

    const project = await this.projectRepository.getProjectById(task.projectId)
    if (!project || !project.rate) return { earnings: 0, rate: 0 }

    const durationInSeconds = task.currentDuration ?? task.duration
    return {
      earnings: (durationInSeconds / 3600) * project.rate,
      rate: project.rate
    }
  }
}
