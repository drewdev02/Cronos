import { Task } from '../models/Task'
import { TaskRepository } from '../repositories/TaskRepository'

export class CreateTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  execute(task: Omit<Task, 'id'>): Promise<Task> {
    return this.repository.createTask(task)
  }
}
