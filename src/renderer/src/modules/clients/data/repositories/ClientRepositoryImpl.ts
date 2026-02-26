import { ClientRepository } from '../../domain/repositories/ClientRepository'
import { Client } from '../../domain/models/Client'
import { ClientMapper } from '../mappers/ClientMapper'

export class ClientRepositoryImpl extends ClientRepository {
  async getClients(): Promise<Client[]> {
    const result = await window.api.clients.getAll()
    return result.map(ClientMapper.toDomain)
  }

  async createClient(client: Client): Promise<Client> {
    const dto = ClientMapper.toDTO(client)
    const created = await window.api.clients.create(dto)
    return ClientMapper.toDomain(created)
  }

  async getClientById(id: string): Promise<Client | null> {
    const res = await window.api.clients.getById(id)
    return res ? ClientMapper.toDomain(res) : null
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    const dto: Partial<typeof ClientMapper.toDTO> = {}
    if (data.name !== undefined) dto['name'] = data.name
    if (data.email !== undefined) dto['email'] = data.email
    const updated = await window.api.clients.update(id, dto)
    return updated ? ClientMapper.toDomain(updated) : null
  }

  async deleteClient(id: string): Promise<boolean> {
    return window.api.clients.delete(id)
  }
}
