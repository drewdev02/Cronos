import { describe, it, expect, vi } from 'vitest'
import { ClientDetailViewModel } from '../ClientDetailViewModel'

describe('ClientDetailViewModel', () => {
  it('loads client and sets error when not found', async () => {
    const mockGet = { execute: vi.fn().mockResolvedValue(null) }
    const vm = new ClientDetailViewModel(mockGet as any)

    const promise = vm.loadClient('missing')
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.error).toBe('Cliente no encontrado')
  })

  it('sets client when found', async () => {
    const client = { id: '1', name: 'A', email: 'a@e.com' }
    const mockGet = { execute: vi.fn().mockResolvedValue(client) }
    const vm = new ClientDetailViewModel(mockGet as any)

    await vm.loadClient('1')
    expect(vm.client).toEqual(client)
    expect(vm.error).toBeNull()
  })
})
