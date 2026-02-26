import { TaskRepository } from '../repositories/TaskRepository'

export class DeleteTaskUseCase {
  constructor(private readonly repository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteTask(id)
  }
}
