import { TaskRepository } from '../repositories/TaskRepository'
import { Task } from '../models/Task'

export class UpdateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(id: string, task: Partial<Task>): Promise<Task> {
    return this.repository.updateTask(id, task)
  }
}
