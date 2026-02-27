import { TaskRepository } from '../../domain/repositories/TaskRepository'
import { Task } from '../../domain/models/Task'
import { TaskMapper } from '../mappers/TaskMapper'

import { TaskDTO } from '@/../../shared/types'

export class TaskRepositoryImpl extends TaskRepository {
  async getTasks(): Promise<Task[]> {
    const result = await window.api.tasks.getAll()
    return result.map(TaskMapper.toDomain)
  }

  async getTaskById(id: string): Promise<Task | null> {
    const result = await window.api.tasks.getById(id)
    if (!result) return null
    return TaskMapper.toDomain(result)
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const dto = {
      ...TaskMapper.toDTO(task),
      id: crypto.randomUUID(),
      createdAt: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const result = await window.api.tasks.create(dto)
    return TaskMapper.toDomain(result)
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const dtoUpdate: Partial<TaskDTO> = {}
    if (task.title !== undefined) dtoUpdate.title = task.title
    if (task.projectId !== undefined) dtoUpdate.projectId = task.projectId ?? null
    if (task.duration !== undefined) dtoUpdate.duration = task.duration
    if (task.createdAt !== undefined) dtoUpdate.createdAt = task.createdAt?.toISOString() ?? null
    if (task.startTime !== undefined) dtoUpdate.startTime = task.startTime?.toISOString() ?? null
    if (task.endTime !== undefined) dtoUpdate.endTime = task.endTime?.toISOString() ?? null
    if (task.status !== undefined) dtoUpdate.status = task.status

    const result = await window.api.tasks.update(id, dtoUpdate)
    if (!result) throw new Error('Task not found')
    return TaskMapper.toDomain(result)
  }

  async deleteTask(id: string): Promise<void> {
    await window.api.tasks.delete(id)
  }
}
