import { describe, it, expect, vi } from 'vitest'
import { CreateClientUseCase } from '../CreateClientUseCase'

describe('CreateClientUseCase', () => {
  it('calls repository.createClient with the provided client', async () => {
    const client = { id: '1', name: 'A', email: 'a@e.com' }

    const mockRepo = {
      createClient: vi.fn().mockResolvedValue(client)
    }

    const uc = new CreateClientUseCase(mockRepo as any)

    const res = await uc.execute(client)

    expect(mockRepo.createClient).toHaveBeenCalledWith(client)
    expect(res).toEqual(client)
  })
})
