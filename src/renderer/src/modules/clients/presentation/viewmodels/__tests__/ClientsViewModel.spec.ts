import { describe, it, expect, vi } from 'vitest'
import { ClientsViewModel } from '../ClientsViewModel'

describe('ClientsViewModel', () => {
  it('sets loading true while loading clients and then false', async () => {
    const mockGet = { execute: vi.fn().mockResolvedValue([{ id: '1', name: 'A', email: 'a@e.com' }]) }
    const vm = new ClientsViewModel(mockGet as any, {} as any, {} as any, {} as any)

    const promise = vm.loadClients()

    expect(vm.loading).toBe(true)

    await promise

    expect(vm.loading).toBe(false)
    expect(vm.clients).toHaveLength(1)
  })

  it('createClient adds created client to the list and toggles loading', async () => {
    const created = { id: '2', name: 'New', email: 'n@e.com' }
    const mockCreate = { execute: vi.fn().mockResolvedValue(created) }
    const vm = new ClientsViewModel({ execute: vi.fn().mockResolvedValue([]) } as any, mockCreate as any, {} as any, {} as any)

    const promise = vm.createClient('New', 'n@e.com')
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.clients[0].id).toBe('2')
  })
})
