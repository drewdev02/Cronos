import { ProjectRepository } from '../repositories/ProjectRepository'
import { Project } from '../models/Project'

export class GetProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.repository.getProjects()
  }
}
