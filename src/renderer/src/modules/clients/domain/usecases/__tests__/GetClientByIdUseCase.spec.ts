import { describe, it, expect, vi } from 'vitest'
import { GetClientByIdUseCase } from '../GetClientByIdUseCase'

describe('GetClientByIdUseCase', () => {
  it('delegates to repository.getClientById', async () => {
    const client = { id: '1', name: 'A', email: 'a@e.com' }
    const mockRepo = { getClientById: vi.fn().mockResolvedValue(client) } as any

    const uc = new GetClientByIdUseCase(mockRepo)

    const res = await uc.execute('1')

    expect(mockRepo.getClientById).toHaveBeenCalledWith('1')
    expect(res).toEqual(client)
  })
})
