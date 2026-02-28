import { Project } from '../../domain/models/Project'
import { ProjectDTO } from '@/../../shared/types'

export class ProjectMapper {

  static toDomain(dto: ProjectDTO): Project {
    return {
      id: dto.id,
      name: dto.name,
      client: dto.client ?? undefined,
      color: dto.color ?? undefined,
      rate: dto.rate ?? undefined,
      totalEarned: dto.totalEarned ?? null
    }
  }

  static toDTO(domain: Project): ProjectDTO {
    return {
      id: domain.id,
      name: domain.name,
      clientId: domain.client?.id ?? null,
      client: domain.client ?? null,
      color: domain.color ?? null,
      rate: domain.rate ?? null,
      totalEarned: domain.totalEarned ?? null,
      createdAt: new Date().toISOString(), // This should ideally come from domain if needed
      updatedAt: new Date().toISOString()
    }
  }
}
