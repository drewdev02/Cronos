import { makeAutoObservable, runInAction } from 'mobx'
import { GetProjectsUseCase } from '../../domain/usecases/GetProjectsUseCase'
import { CreateProjectUseCase } from '../../domain/usecases/CreateProjectUseCase'
import { UpdateProjectUseCase } from '../../domain/usecases/UpdateProjectUseCase'
import { DeleteProjectUseCase } from '../../domain/usecases/DeleteProjectUseCase'
import { Project } from '../../domain/models/Project'

export class ProjectsViewModel {
  projects: Project[] = []
  loading = false

  constructor(
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase
  ) {
    makeAutoObservable(this)
  }

  async loadProjects(): Promise<void> {
    this.loading = true
    try {
      const result = await this.getProjectsUseCase.execute()
      runInAction(() => {
        this.projects = result
      })
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async createProject(project: Project): Promise<void> {
    try {
      await this.createProjectUseCase.execute(project)
      await this.loadProjects()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    try {
      await this.updateProjectUseCase.execute(id, project)
      await this.loadProjects()
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await this.deleteProjectUseCase.execute(id)
      await this.loadProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }
}
