import { makeAutoObservable, runInAction } from 'mobx'
import { GetClientsUseCase } from '../../domain/usecases/GetClientsUseCase'
import { Client } from '../../domain/models/Client'

export class ClientsViewModel {
  clients: Client[] = []
  loading = false

  constructor(private readonly getClientsUseCase: GetClientsUseCase) {
    makeAutoObservable(this)
  }

  async loadClients(): Promise<void> {
    this.loading = true
    try {
      const result = await this.getClientsUseCase.execute()
      runInAction(() => {
        this.clients = result
      })
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
