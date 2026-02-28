import { describe, it, expect, vi } from 'vitest'
import { UpdateClientUseCase } from '../UpdateClientUseCase'

describe('UpdateClientUseCase', () => {
  it('calls repository.updateClient and returns updated client', async () => {
    const updated = { id: '1', name: 'B', email: 'b@e.com' }
    const mockRepo = { updateClient: vi.fn().mockResolvedValue(updated) } as any

    const uc = new UpdateClientUseCase(mockRepo)

    const res = await uc.execute('1', { name: 'B' })

    expect(mockRepo.updateClient).toHaveBeenCalledWith('1', { name: 'B' })
    expect(res).toEqual(updated)
  })
})
