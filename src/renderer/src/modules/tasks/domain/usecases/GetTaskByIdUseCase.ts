import { Task } from '../models/Task'
import { TaskRepository } from '../repositories/TaskRepository'

export class GetTaskByIdUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(id: string): Promise<Task | null> {
    return this.repository.getTaskById(id)
  }
}
