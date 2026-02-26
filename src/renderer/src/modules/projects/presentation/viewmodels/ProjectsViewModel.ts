import { makeAutoObservable, runInAction } from 'mobx'
import { GetProjectsUseCase } from '../../domain/usecases/GetProjectsUseCase'
import { Project } from '../../domain/models/Project'

export class ProjectsViewModel {
  projects: Project[] = []
  loading = false

  constructor(private readonly getProjectsUseCase: GetProjectsUseCase) {
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
}
