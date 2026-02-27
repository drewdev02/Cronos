import { makeAutoObservable, runInAction } from 'mobx'
import { GetTasksUseCase } from '../../domain/usecases/GetTasksUseCase'
import { CreateTaskUseCase } from '../../domain/usecases/CreateTaskUseCase'
import { UpdateTaskUseCase } from '../../domain/usecases/UpdateTaskUseCase'
import { DeleteTaskUseCase } from '../../domain/usecases/DeleteTaskUseCase'
import { StartTaskTimerUseCase } from '../../domain/usecases/StartTaskTimerUseCase'
import { StopTaskTimerUseCase } from '../../domain/usecases/StopTaskTimerUseCase'
import { Task } from '../../domain/models/Task'

export class TasksViewModel {
  tasks: Task[] = []
  loading = false
  private timer: NodeJS.Timeout | null = null

  constructor(
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly startTaskTimerUseCase: StartTaskTimerUseCase,
    private readonly stopTaskTimerUseCase: StopTaskTimerUseCase
  ) {
    makeAutoObservable(this)
  }

  async loadTasks(): Promise<void> {
    this.loading = true
    try {
      const result = await this.getTasksUseCase.execute()
      runInAction(() => {
        this.tasks = result
        this.checkRunningTasks()
      })
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  private checkRunningTasks(): void {
    const runningTask = this.tasks.find((t) => t.status === 'in_progress')
    if (runningTask && !this.timer) {
      this.startTimer()
    }
  }

  private startTimer(): void {
    if (this.timer) return
    this.timer = this.startTaskTimerUseCase.execute(
      () => this.tasks,
      (updatedTasks) => {
        runInAction(() => {
          this.tasks = updatedTasks
        })
      }
    )
  }

  async createTask(title: string, projectId?: string, createdAt?: Date): Promise<void> {
    this.loading = true
    try {
      const newTask = await this.createTaskUseCase.execute({
        title,
        projectId,
        duration: 0,
        status: 'pending',
        createdAt: createdAt ?? new Date()
      })
      runInAction(() => {
        this.tasks.push(newTask)
      })
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async toggleTask(task: Task): Promise<void> {
    if (task.status === 'in_progress') {
      await this.stopTask(task)
    } else {
      await this.startTask(task)
    }
  }

  async startTask(task: Task): Promise<void> {
    // Stop any other running task
    const running = this.tasks.find((t) => t.status === 'in_progress')
    if (running) await this.stopTask(running)

    const startTime = new Date()
    const updated = await this.updateTaskUseCase.execute(task.id, {
      status: 'in_progress',
      startTime
    })

    runInAction(() => {
      const index = this.tasks.findIndex((t) => t.id === task.id)
      if (index !== -1) this.tasks[index] = updated
      this.startTimer()
    })
  }

  async stopTask(task: Task): Promise<void> {
    const now = new Date()
    const startTime = task.startTime ? new Date(task.startTime) : now
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
    const newDuration = task.duration + Math.max(0, elapsed)

    const updated = await this.updateTaskUseCase.execute(task.id, {
      status: 'pending',
      startTime: undefined,
      duration: newDuration
    })

    runInAction(() => {
      const index = this.tasks.findIndex((t) => t.id === task.id)
      if (index !== -1) this.tasks[index] = updated

      const running = this.tasks.some((t) => t.status === 'in_progress')
      if (!running && this.timer) {
        this.stopTaskTimerUseCase.execute(this.timer)
        this.timer = null
      }
    })
  }

  async deleteTask(id: string): Promise<void> {
    const task = this.tasks.find((t) => t.id === id)
    if (task?.status === 'in_progress') {
      console.warn('Cannot delete a running task')
      return
    }

    await this.deleteTaskUseCase.execute(id)
    runInAction(() => {
      this.tasks = this.tasks.filter((t) => t.id !== id)
    })
  }

  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    const updated = await this.updateTaskUseCase.execute(id, data)
    runInAction(() => {
      const index = this.tasks.findIndex((t) => t.id === id)
      if (index !== -1) this.tasks[index] = updated
    })
  }
}
