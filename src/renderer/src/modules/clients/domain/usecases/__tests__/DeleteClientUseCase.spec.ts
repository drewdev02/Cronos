import { describe, it, expect, vi } from 'vitest'

import { DeleteClientUseCase } from '../DeleteClientUseCase'

describe('DeleteClientUseCase', () => {
  it('calls repository.deleteClient and returns boolean', async () => {
    const mockRepo = { deleteClient: vi.fn().mockResolvedValue(true) } as any

    const uc = new DeleteClientUseCase(mockRepo)

    const res = await uc.execute('1')

    expect(mockRepo.deleteClient).toHaveBeenCalledWith('1')
    expect(res).toBe(true)
  })
})
