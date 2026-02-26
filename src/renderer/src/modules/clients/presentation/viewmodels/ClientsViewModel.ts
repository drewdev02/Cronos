import { makeAutoObservable, runInAction } from 'mobx'
import { GetClientsUseCase } from '../../domain/usecases/GetClientsUseCase'
import { CreateClientUseCase } from '../../domain/usecases/CreateClientUseCase'
import { UpdateClientUseCase } from '../../domain/usecases/UpdateClientUseCase'
import { DeleteClientUseCase } from '../../domain/usecases/DeleteClientUseCase'
import { Client } from '../../domain/models/Client'

export class ClientsViewModel {
  clients: Client[] = []
  loading = false

  constructor(
    private readonly getClientsUseCase: GetClientsUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase
  ) {
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

  async createClient(name: string, email: string): Promise<void> {
    this.loading = true
    try {
      const client: Client = {
        id: (crypto as any).randomUUID(),
        name,
        email
      }
      const created = await this.createClientUseCase.execute(client)
      runInAction(() => {
        this.clients = [created, ...this.clients]
      })
    } catch (error) {
      console.error('Error creating client:', error)
    } finally {
      runInAction(() => (this.loading = false))
    }
  }

  async updateClient(id: string, data: Partial<Client>): Promise<void> {
    if (!this.updateClientUseCase) throw new Error('UpdateClientUseCase not available')
    this.loading = true
    try {
      const updated = await this.updateClientUseCase.execute(id, data)
      if (updated) {
        runInAction(() => {
          this.clients = this.clients.map((c) => (c.id === id ? updated : c))
        })
      }
    } catch (error) {
      console.error('Error updating client:', error)
    } finally {
      runInAction(() => (this.loading = false))
    }
  }

  async deleteClient(id: string): Promise<void> {
    
    this.loading = true
    try {
      const ok = await this.deleteClientUseCase.execute(id)
      if (ok) {
        runInAction(() => {
          this.clients = this.clients.filter((c) => c.id !== id)
        })
      }
    } catch (error) {
      console.error('Error deleting client:', error)
    } finally {
      runInAction(() => (this.loading = false))
    }
  }
}
