import { ProjectRepository } from '../../domain/repositories/ProjectRepository'
import { Project } from '../../domain/models/Project'
import { ProjectMapper } from '../mappers/ProjectMapper'

export class ProjectRepositoryImpl extends ProjectRepository {
  async getProjects(): Promise<Project[]> {
    const result = await window.api.projects.getAll()
    return result.map(ProjectMapper.toDomain)
  }

  async getProjectById(id: string): Promise<Project | null> {
    const result = await window.api.projects.getById(id)
    if (!result) return null
    return ProjectMapper.toDomain(result)
  }
}
