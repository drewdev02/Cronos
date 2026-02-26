import { ClientRepository } from '../repositories/ClientRepository'
import { Client } from '../models/Client'

export class CreateClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute(client: Client): Promise<Client> {
    return this.repository.createClient(client)
  }
}
