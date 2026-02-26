import { makeAutoObservable } from 'mobx'
import { Client } from '../../domain/models/Client'
import { GetClientByIdUseCase } from '../../domain/usecases/GetClientByIdUseCase'

export class ClientDetailViewModel {
  client: Client | null = null
  loading = false
  error: string | null = null

  constructor(private readonly getClientByIdUseCase: GetClientByIdUseCase) {
    makeAutoObservable(this)
  }

  async loadClient(id: string): Promise<void> {
    this.loading = true
    this.error = null
    try {
      this.client = await this.getClientByIdUseCase.execute(id)
      if (!this.client) this.error = 'Cliente no encontrado'
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error cargando cliente'
    } finally {
      this.loading = false
    }
  }
}
