import { makeAutoObservable, runInAction } from 'mobx';
import { Project } from '../../domain/models/Project';
import { Task } from '@/modules/tasks/domain/models/Task';
import { ProjectsRepository } from '../../domain/repositories/ProjectsRepository';
import { TasksRepository } from '@/modules/tasks/domain/repositories/TasksRepository';

export class ProjectDetailViewModel {
  project: Project | null = null;
  tasks: Task[] = [];
  loading = false;
  totalEarned = 0;

  constructor(
    private projectsRepo: ProjectsRepository,
    private tasksRepo: TasksRepository
  ) {
    makeAutoObservable(this);
  }

  async loadProject(id: string) {
    this.loading = true;
    try {
      // getById y getTasks filtradas por projectId
      const project = await this.projectsRepo.getProjectById(id);
      // getTasks no tiene getByProjectId, así que filtramos manualmente
      const allTasks = await this.tasksRepo.getTasks();
      const tasks = allTasks.filter(t => t.projectId === id);
      let total = 0;
      for (const t of tasks) {
        total += (t.duration ?? 0) * (project?.rate ?? 0);
      }
      runInAction(() => {
        this.project = project;
        this.tasks = tasks;
        this.totalEarned = total;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.project = null;
        this.tasks = [];
        this.totalEarned = 0;
        this.loading = false;
      });
    }
  }
}
