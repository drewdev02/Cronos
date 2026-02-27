import { ClientMapper } from '../../mappers/ClientMapper'
import { describe, it, expect } from 'vitest'

describe('ClientMapper', () => {
  it('maps DTO to domain', () => {
    const dto = { id: '1', name: 'A', email: 'a@e.com', createdAt: '', updatedAt: '' }
    const domain = ClientMapper.toDomain(dto)

    expect(domain).toEqual({ id: '1', name: 'A', email: 'a@e.com' })
  })

  it('maps domain to DTO and includes timestamps', () => {
    const domain = { id: '1', name: 'A', email: 'a@e.com' }
    const dto = ClientMapper.toDTO(domain)

    expect(dto.id).toBe(domain.id)
    expect(dto.name).toBe(domain.name)
    expect(dto.email).toBe(domain.email)
    expect(typeof dto.createdAt).toBe('string')
    expect(typeof dto.updatedAt).toBe('string')
  })
})
