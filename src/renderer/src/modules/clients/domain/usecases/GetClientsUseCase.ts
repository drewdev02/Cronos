import { ClientRepository } from '../repositories/ClientRepository'
import { Client } from '../models/Client'

export class GetClientsUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.repository.getClients()
  }
}
