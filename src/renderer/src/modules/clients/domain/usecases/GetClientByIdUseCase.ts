import { Client } from '../models/Client'
import { ClientRepository } from '../repositories/ClientRepository'

export class GetClientByIdUseCase {
  constructor(private readonly repository: ClientRepository) {}

  execute(id: string): Promise<Client | null> {
    return this.repository.getClientById(id)
  }
}
