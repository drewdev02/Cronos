import { ProjectRepository } from '../repositories/ProjectRepository'

export class DeleteProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.repository.deleteProject(id)
  }
}
