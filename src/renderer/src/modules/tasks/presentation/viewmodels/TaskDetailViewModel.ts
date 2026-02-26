import { makeAutoObservable } from 'mobx'
import { Task } from '../../domain/models/Task'
import { GetTaskByIdUseCase } from '../../domain/usecases/GetTaskByIdUseCase'
import { CalculateTaskEarningsUseCase } from '../../domain/usecases/CalculateTaskEarningsUseCase'

export class TaskDetailViewModel {
  task: Task | null = null
  loading: boolean = false
  error: string | null = null
  moneyGenerated: number = 0
  projectRate: number = 0

  constructor(
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly calculateTaskEarningsUseCase: CalculateTaskEarningsUseCase
  ) {
    makeAutoObservable(this)
  }

  async loadTask(id: string): Promise<void> {
    this.loading = true
    this.error = null
    try {
      this.task = await this.getTaskByIdUseCase.execute(id)
      if (this.task) {
        const result = await this.calculateTaskEarningsUseCase.execute(this.task)
        this.moneyGenerated = result.earnings
        this.projectRate = result.rate
      } else {
        this.moneyGenerated = 0
        this.projectRate = 0
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error loading task'
    } finally {
      this.loading = false
    }
  }
}
