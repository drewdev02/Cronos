import { ProjectRepository } from '../repositories/ProjectRepository'
import { Project } from '../models/Project'

export class UpdateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: string, project: Partial<Project>): Promise<Project | null> {
    return this.repository.updateProject(id, project)
  }
}
