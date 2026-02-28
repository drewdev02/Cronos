import { ProjectRepository } from '../repositories/ProjectRepository'

export class GetProjectClientsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<{ id: string; name: string }[]> {
    return this.repository.getClients()
  }
}
