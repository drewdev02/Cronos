import { Client } from '../models/Client'
import { ClientRepository } from '../repositories/ClientRepository'

export class UpdateClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  execute(id: string, data: Partial<Client>): Promise<Client | null> {
    return this.repository.updateClient(id, data)
  }
}
