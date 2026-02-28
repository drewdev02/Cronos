import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository';
import { TaskRepository } from '@/modules/tasks/domain/repositories/TaskRepository';
import { ProjectDetailViewModel } from '@/modules/projects/presentation/viewmodels/ProjectDetailViewModel';

export function provideProjectDetailViewModel() {
  return new ProjectDetailViewModel(
    window.diContainer.get(ProjectRepository),
    window.diContainer.get(TaskRepository)
  );
}
