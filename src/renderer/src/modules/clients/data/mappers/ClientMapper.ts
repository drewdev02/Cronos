import { Client } from '../../domain/models/Client'
import { ClientDTO } from '@/../../shared/types'

export class ClientMapper {
  static toDomain(dto: ClientDTO): Client {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email
    }
  }

  static toDTO(domain: Client): ClientDTO {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}
