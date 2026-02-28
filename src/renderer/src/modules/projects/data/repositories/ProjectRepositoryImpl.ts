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

  async createProject(project: Project): Promise<Project> {
    const dto = ProjectMapper.toDTO(project)
    await window.api.projects.create(dto)
    return ProjectMapper.toDomain(dto)
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
    // build partial DTO
    const existing = await window.api.projects.getById(id)
    if (!existing) return null
    const merged = { ...existing, ...project, updatedAt: new Date().toISOString() }
    await window.api.projects.update(id, merged)
    return ProjectMapper.toDomain(merged)
  }

  async deleteProject(id: string): Promise<boolean> {
    return window.api.projects.delete(id)
  }

  async getClients(): Promise<{ id: string; name: string }[]> {
    return window.api.clients.getLite()
  }
}
