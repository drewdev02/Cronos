import { Project } from '../models/Project'

export abstract class ProjectRepository {
  abstract getProjects(): Promise<Project[]>
  abstract getProjectById(id: string): Promise<Project | null>
  abstract createProject(project: Project): Promise<Project>
  abstract updateProject(id: string, project: Partial<Project>): Promise<Project | null>
  abstract deleteProject(id: string): Promise<boolean>
}
