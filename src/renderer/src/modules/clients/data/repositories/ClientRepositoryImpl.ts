import { ClientRepository } from '../../domain/repositories/ClientRepository'
import { Client } from '../../domain/models/Client'
import { ClientMapper } from '../mappers/ClientMapper'

export class ClientRepositoryImpl extends ClientRepository {
  async getClients(): Promise<Client[]> {
    const result = await window.api.clients.getAll()
    return result.map(ClientMapper.toDomain)
  }
}
