import { ClientRepository } from '../repositories/ClientRepository'

export class DeleteClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  execute(id: string): Promise<boolean> {
    return this.repository.deleteClient(id)
  }
}
