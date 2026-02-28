import { describe, it, expect, vi } from 'vitest'
import { GetClientsUseCase } from '../GetClientsUseCase'

describe('GetClientsUseCase', () => {
  it('calls repository.getClients and returns the result', async () => {
    const mockRepo = { getClients: vi.fn().mockResolvedValue([{ id: '1', name: 'A', email: 'a@e.com' }]) } as any

    const uc = new GetClientsUseCase(mockRepo)

    const res = await uc.execute()

    expect(mockRepo.getClients).toHaveBeenCalled()
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('1')
  })
})
