import { vi } from 'vitest'
import { ClientRepositoryImpl } from '../ClientRepositoryImpl'
import { ClientMapper } from '../../mappers/ClientMapper'

describe('ClientRepositoryImpl', () => {
  beforeEach(() => {
    ;(window as any).api = { clients: {} }
  })

  it('getClients calls window.api.clients.getAll and maps results', async () => {
    const dto = { id: '1', name: 'A', email: 'a@e.com', createdAt: '', updatedAt: '' }
    ;(window as any).api.clients.getAll = vi.fn().mockResolvedValue([dto])

    const repo = new ClientRepositoryImpl()

    const res = await repo.getClients()

    expect((window as any).api.clients.getAll).toHaveBeenCalled()
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('1')
  })

  it('createClient sends DTO and returns mapped domain', async () => {
    const domain = { id: '1', name: 'A', email: 'a@e.com' }
    const dto = ClientMapper.toDTO(domain as any)
    ;(window as any).api.clients.create = vi.fn().mockResolvedValue(dto)

    const repo = new ClientRepositoryImpl()

    const res = await repo.createClient(domain as any)

    expect((window as any).api.clients.create).toHaveBeenCalled()
    expect(res.id).toBe(domain.id)
  })

  it('getClientById returns null when api returns null', async () => {
    ;(window as any).api.clients.getById = vi.fn().mockResolvedValue(null)
    const repo = new ClientRepositoryImpl()
    const res = await repo.getClientById('missing')
    expect(res).toBeNull()
  })

  it('updateClient calls update and returns mapped domain or null', async () => {
    const updatedDto = { id: '1', name: 'B', email: 'b@e.com', createdAt: '', updatedAt: '' }
    ;(window as any).api.clients.update = vi.fn().mockResolvedValue(updatedDto)

    const repo = new ClientRepositoryImpl()
    const res = await repo.updateClient('1', { name: 'B' })

    expect((window as any).api.clients.update).toHaveBeenCalled()
    expect(res).not.toBeNull()
    expect(res!.name).toBe('B')
  })

  it('deleteClient proxies to api.delete', async () => {
    ;(window as any).api.clients.delete = vi.fn().mockResolvedValue(true)
    const repo = new ClientRepositoryImpl()
    const res = await repo.deleteClient('1')
    expect((window as any).api.clients.delete).toHaveBeenCalledWith('1')
    expect(res).toBe(true)
  })
})
