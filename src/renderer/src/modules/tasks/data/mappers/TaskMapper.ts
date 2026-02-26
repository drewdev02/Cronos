import { Task } from '../../domain/models/Task'
import { TaskDTO } from '@/../../shared/types'

export class TaskMapper {
  static toDomain(dto: TaskDTO): Task {
    return {
      id: dto.id,
      title: dto.title,
      projectId: dto.projectId ?? undefined,
      duration: dto.duration,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      status: dto.status
    }
  }

  static toDTO(domain: Omit<Task, 'id'>): Omit<TaskDTO, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: domain.title,
      projectId: domain.projectId ?? null,
      duration: domain.duration,
      startTime: domain.startTime?.toISOString() ?? null,
      endTime: domain.endTime?.toISOString() ?? null,
      status: domain.status
    }
  }
}
