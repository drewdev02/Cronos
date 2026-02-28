import { Container } from 'inversify'
import { DashboardRepository } from '@/modules/dashboard/domain/repositories/DashboardRepository'
import { DashboardRepositoryImpl } from '@/modules/dashboard/data/repositories/DashboardRepositoryImpl'
import { GetDashboardStatsUseCase } from '@/modules/dashboard/domain/usecases/GetDashboardStatsUseCase'
import { DashboardViewModel } from '@/modules/dashboard/presentation/viewmodels/DashboardViewModel'
import { ClientsViewModel } from '@/modules/clients/presentation/viewmodels/ClientsViewModel'
import { ClientDetailViewModel } from '@/modules/clients/presentation/viewmodels/ClientDetailViewModel'
import { GetClientsUseCase } from '@/modules/clients/domain/usecases/GetClientsUseCase'
import { CreateClientUseCase } from '@/modules/clients/domain/usecases/CreateClientUseCase'
import { GetClientByIdUseCase } from '@/modules/clients/domain/usecases/GetClientByIdUseCase'
import { UpdateClientUseCase } from '@/modules/clients/domain/usecases/UpdateClientUseCase'
import { DeleteClientUseCase } from '@/modules/clients/domain/usecases/DeleteClientUseCase'
import { ClientRepository } from '@/modules/clients/domain/repositories/ClientRepository'
import { ClientRepositoryImpl } from '@/modules/clients/data/repositories/ClientRepositoryImpl'
import { ProjectsViewModel } from '@/modules/projects/presentation/viewmodels/ProjectsViewModel'
import { GetProjectsUseCase } from '@/modules/projects/domain/usecases/GetProjectsUseCase'
import { CreateProjectUseCase } from '@/modules/projects/domain/usecases/CreateProjectUseCase'
import { UpdateProjectUseCase } from '@/modules/projects/domain/usecases/UpdateProjectUseCase'
import { DeleteProjectUseCase } from '@/modules/projects/domain/usecases/DeleteProjectUseCase'
import { GetProjectClientsUseCase } from '@/modules/projects/domain/usecases/GetProjectClientsUseCase'
import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository'
import { ProjectRepositoryImpl } from '@/modules/projects/data/repositories/ProjectRepositoryImpl'
import { TasksViewModel } from '@/modules/tasks/presentation/viewmodels/TasksViewModel'
import { GetTasksUseCase } from '@/modules/tasks/domain/usecases/GetTasksUseCase'
import { CreateTaskUseCase } from '@/modules/tasks/domain/usecases/CreateTaskUseCase'
import { UpdateTaskUseCase } from '@/modules/tasks/domain/usecases/UpdateTaskUseCase'
import { DeleteTaskUseCase } from '@/modules/tasks/domain/usecases/DeleteTaskUseCase'
import { TaskRepository } from '@/modules/tasks/domain/repositories/TaskRepository'
import { TaskRepositoryImpl } from '@/modules/tasks/data/repositories/TaskRepositoryImpl'
import { GetTaskByIdUseCase } from '@/modules/tasks/domain/usecases/GetTaskByIdUseCase'
import { CalculateTaskEarningsUseCase } from '@/modules/tasks/domain/usecases/CalculateTaskEarningsUseCase'
import { TaskDetailViewModel } from '@/modules/tasks/presentation/viewmodels/TaskDetailViewModel'
import { TrayRepository } from '@/modules/tasks/domain/repositories/TrayRepository'
import { TrayRepositoryImpl } from '@/modules/tasks/data/repositories/TrayRepositoryImpl'
import { StartTaskTimerUseCase } from '@/modules/tasks/domain/usecases/StartTaskTimerUseCase'
import { StopTaskTimerUseCase } from '@/modules/tasks/domain/usecases/StopTaskTimerUseCase'
import { StatisticsViewModel } from '@/modules/statistics/presentation/viewmodels/StatisticsViewModel'
import { GetStatisticsUseCase } from '@/modules/statistics/domain/usecases/GetStatisticsUseCase'
import { StatisticsRepository } from '@/modules/statistics/domain/repositories/StatisticsRepository'
import { StatisticsRepositoryImpl } from '@/modules/statistics/data/repositories/StatisticsRepositoryImpl'
import { ProjectDetailViewModel } from '@renderer/modules/projects/presentation/viewmodels/ProjectDetailViewModel'

export const container = new Container({
  defaultScope: 'Singleton'
})

// Dashboard Module
container.bind<DashboardRepository>(DashboardRepository).toDynamicValue(() => {
  return new DashboardRepositoryImpl()
})

container.bind(GetDashboardStatsUseCase).toDynamicValue(() => {
  return new GetDashboardStatsUseCase(container.get(DashboardRepository))
})

container.bind(DashboardViewModel).toDynamicValue(() => {
  return new DashboardViewModel(container.get(GetDashboardStatsUseCase))
})

// Clients Module
container.bind<ClientRepository>(ClientRepository).toDynamicValue(() => {
  return new ClientRepositoryImpl()
})

container.bind(GetClientsUseCase).toDynamicValue(() => {
  return new GetClientsUseCase(container.get(ClientRepository))
})

container.bind(CreateClientUseCase).toDynamicValue(() => {
  return new CreateClientUseCase(container.get(ClientRepository))
})

container.bind(GetClientByIdUseCase).toDynamicValue(() => {
  return new GetClientByIdUseCase(container.get(ClientRepository))
})

container.bind(UpdateClientUseCase).toDynamicValue(() => {
  return new UpdateClientUseCase(container.get(ClientRepository))
})

container.bind(DeleteClientUseCase).toDynamicValue(() => {
  return new DeleteClientUseCase(container.get(ClientRepository))
})

container.bind(ClientsViewModel).toDynamicValue(() => {
  return new ClientsViewModel(
    container.get(GetClientsUseCase),
    container.get(CreateClientUseCase),
    container.get(UpdateClientUseCase),
    container.get(DeleteClientUseCase)
  )
})

container.bind(ClientDetailViewModel).toDynamicValue(() => {
  return new ClientDetailViewModel(container.get(GetClientByIdUseCase))
})

// Projects Module
container.bind<ProjectRepository>(ProjectRepository).toDynamicValue(() => {
  return new ProjectRepositoryImpl()
})

container.bind(GetProjectsUseCase).toDynamicValue(() => {
  return new GetProjectsUseCase(container.get(ProjectRepository))
})

container.bind(CreateProjectUseCase).toDynamicValue(() => {
  return new CreateProjectUseCase(container.get(ProjectRepository))
})

container.bind(UpdateProjectUseCase).toDynamicValue(() => {
  return new UpdateProjectUseCase(container.get(ProjectRepository))
})

container.bind(DeleteProjectUseCase).toDynamicValue(() => {
  return new DeleteProjectUseCase(container.get(ProjectRepository))
})

container.bind(GetProjectClientsUseCase).toDynamicValue(() => {
  return new GetProjectClientsUseCase(container.get(ProjectRepository))
})

container.bind(ProjectsViewModel).toDynamicValue(() => {
  return new ProjectsViewModel(
    container.get(GetProjectsUseCase),
    container.get(CreateProjectUseCase),
    container.get(UpdateProjectUseCase),
    container.get(DeleteProjectUseCase),
    container.get(GetProjectClientsUseCase)
  )
})

// Project Detail
container.bind(ProjectDetailViewModel).toDynamicValue(() => {
  return new ProjectDetailViewModel(container.get(ProjectRepository), container.get(TaskRepository))
})

// Tasks Module
container.bind<TaskRepository>(TaskRepository).toDynamicValue(() => {
  return new TaskRepositoryImpl()
})

container.bind(GetTasksUseCase).toDynamicValue(() => {
  return new GetTasksUseCase(container.get(TaskRepository))
})

container.bind(CreateTaskUseCase).toDynamicValue(() => {
  return new CreateTaskUseCase(container.get(TaskRepository))
})

container.bind(UpdateTaskUseCase).toDynamicValue(() => {
  return new UpdateTaskUseCase(container.get(TaskRepository))
})

container.bind(DeleteTaskUseCase).toDynamicValue(() => {
  return new DeleteTaskUseCase(container.get(TaskRepository))
})

container.bind<TrayRepository>(TrayRepository).toDynamicValue(() => {
  return new TrayRepositoryImpl()
})

container.bind(StartTaskTimerUseCase).toDynamicValue(() => {
  return new StartTaskTimerUseCase(container.get(TrayRepository))
})

container.bind(StopTaskTimerUseCase).toDynamicValue(() => {
  return new StopTaskTimerUseCase(container.get(TrayRepository))
})

container.bind(TasksViewModel).toDynamicValue(() => {
  return new TasksViewModel(
    container.get(GetProjectsUseCase),
    container.get(CalculateTaskEarningsUseCase),
    container.get(GetTasksUseCase),
    container.get(CreateTaskUseCase),
    container.get(UpdateTaskUseCase),
    container.get(DeleteTaskUseCase),
    container.get(StartTaskTimerUseCase),
    container.get(StopTaskTimerUseCase)
  )
})

container.bind(GetTaskByIdUseCase).toDynamicValue(() => {
  return new GetTaskByIdUseCase(container.get(TaskRepository))
})

container.bind(CalculateTaskEarningsUseCase).toDynamicValue(() => {
  return new CalculateTaskEarningsUseCase(container.get(ProjectRepository))
})

container.bind(TaskDetailViewModel).toDynamicValue(() => {
  return new TaskDetailViewModel(
    container.get(GetTaskByIdUseCase),
    container.get(CalculateTaskEarningsUseCase)
  )
})

// Statistics Module
container.bind<StatisticsRepository>(StatisticsRepository).toDynamicValue(() => {
  return new StatisticsRepositoryImpl()
})

container.bind(GetStatisticsUseCase).toDynamicValue(() => {
  return new GetStatisticsUseCase(container.get(StatisticsRepository))
})

container.bind(StatisticsViewModel).toDynamicValue(() => {
  return new StatisticsViewModel(container.get(GetStatisticsUseCase))
})
