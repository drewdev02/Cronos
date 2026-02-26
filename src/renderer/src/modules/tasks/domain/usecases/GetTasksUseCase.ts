import { TaskRepository } from '../repositories/TaskRepository'
import { Task } from '../models/Task'

export class GetTasksUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.repository.getTasks()
  }
}
