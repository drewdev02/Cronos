import { ProjectRepository } from '../repositories/ProjectRepository'
import { Project } from '../models/Project'

export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(project: Project): Promise<Project> {
    return this.repository.createProject(project)
  }
}
