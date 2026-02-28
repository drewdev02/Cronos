import { describe, it, expect, vi } from 'vitest'
import { TasksViewModel } from '../TasksViewModel'
import { GetProjectsUseCase } from '@/modules/projects/domain/usecases/GetProjectsUseCase'
import { GetTasksUseCase } from '../../domain/usecases/GetTasksUseCase'
import { CalculateTaskEarningsUseCase } from '../../domain/usecases/CalculateTaskEarningsUseCase'
import { CreateTaskUseCase } from '../../domain/usecases/CreateTaskUseCase'
import { Task } from '../../domain/models/Task'
import { Project } from '@/modules/projects/domain/models/Project'
import { UpdateTaskUseCase } from '../../domain/usecases/UpdateTaskUseCase'
import { DeleteTaskUseCase } from '../../domain/usecases/DeleteTaskUseCase'
import { StartTaskTimerUseCase } from '../../domain/usecases/StartTaskTimerUseCase'
import { StopTaskTimerUseCase } from '../../domain/usecases/StopTaskTimerUseCase'

describe('TasksViewModel', () => {
  it('sets loading true while loading tasks and then false and populates tasks', async () => {
    const tasks: Task[] = [{ id: '1', title: 'T1', duration: 0, status: 'pending' } as Task]
    const projects: Project[] = [{ id: 'p1', name: 'P1', rate: 10 } as Project]

    const mockGetProjects = { execute: vi.fn().mockResolvedValue(projects) } as unknown as GetProjectsUseCase
    const mockGetTasks = { execute: vi.fn().mockResolvedValue(tasks) } as unknown as GetTasksUseCase
    const mockCalc = { execute: vi.fn().mockResolvedValue({ earnings: 0, rate: 10 }) } as unknown as CalculateTaskEarningsUseCase

    const vm = new TasksViewModel(
      mockGetProjects,
      mockCalc,
      mockGetTasks,
      {} as unknown as CreateTaskUseCase,
      {} as unknown as UpdateTaskUseCase,
      {} as unknown as DeleteTaskUseCase,
      {} as unknown as StartTaskTimerUseCase,
      {} as unknown as StopTaskTimerUseCase
    )

    const promise = vm.loadTasks()
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.tasks).toHaveLength(1)
    expect(vm.tasksWithProject[0].earnings).toBe(0)
  })

  it('createTask adds created task to the list and toggles loading', async () => {
    const created: Task = { id: '2', title: 'New', duration: 0, status: 'pending' } as Task
    const mockCreate = { execute: vi.fn().mockResolvedValue(created) } as unknown as CreateTaskUseCase
    const vm = new TasksViewModel(
      { execute: vi.fn().mockResolvedValue([]) } as unknown as GetProjectsUseCase,
      { execute: vi.fn().mockResolvedValue({ earnings: 0, rate: 0 }) } as unknown as CalculateTaskEarningsUseCase,
      { execute: vi.fn().mockResolvedValue([]) } as unknown as GetTasksUseCase,
      mockCreate,
      {} as unknown as UpdateTaskUseCase,
      {} as unknown as DeleteTaskUseCase,
      {} as unknown as StartTaskTimerUseCase,
      {} as unknown as StopTaskTimerUseCase
    )

    const promise = vm.createTask('New')
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.tasks[0].id).toBe('2')
  })
})
