import { makeAutoObservable, runInAction } from 'mobx'
import { GetStatisticsUseCase } from '../../domain/usecases/GetStatisticsUseCase'
import { Statistics } from '../../domain/models/Statistics'

export class StatisticsViewModel {
  stats: Statistics | null = null
  loading = false

  constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {
    makeAutoObservable(this)
  }

  async load() {
    this.loading = true
    try {
      const result = await this.getStatisticsUseCase.execute()
      runInAction(() => {
        this.stats = result
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
