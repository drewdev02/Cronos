import { Project } from '../models/Project'

export abstract class ProjectRepository {
  abstract getProjects(): Promise<Project[]>
  abstract getProjectById(id: string): Promise<Project | null>
}
