import { vi } from 'vitest'
import { TaskRepositoryImpl } from '../TaskRepositoryImpl'
import { Task } from '../../domain/models/Task'
import { TaskDTO } from '@/../../shared/types'
import { TaskMapper } from '../../mappers/TaskMapper'

describe('TaskRepositoryImpl', () => {
  beforeEach(() => {
    ;(window as any).api = { tasks: {} }
  })

  it('getTasks calls window.api.tasks.getAll and maps results', async () => {
    const dto: TaskDTO = { id: '1', title: 'T', projectId: null, duration: 0, startTime: null, endTime: null, status: 'pending', createdAt: '', updatedAt: '' }
    ;(window as any).api.tasks.getAll = vi.fn().mockResolvedValue([dto])

    const repo = new TaskRepositoryImpl()

    const res = await repo.getTasks()

    expect((window as any).api.tasks.getAll).toHaveBeenCalled()
    expect(res).toHaveLength(1)
    expect(res[0].id).toBe('1')
  })

  it('createTask sends DTO and returns mapped domain', async () => {
    const domain: Omit<Task, 'id'> = { title: 'New', projectId: undefined, duration: 0, startTime: undefined, endTime: undefined, status: 'pending', createdAt: new Date() }
    const returnedDto: TaskDTO = { id: '2', title: 'New', projectId: null, duration: 0, startTime: null, endTime: null, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ;(window as any).api.tasks.create = vi.fn().mockResolvedValue(returnedDto)

    const repo = new TaskRepositoryImpl()
    const res = await repo.createTask(domain)

    expect((window as any).api.tasks.create).toHaveBeenCalled()
    expect(res.id).toBe('2')
  })

  it('getTaskById returns null when api returns null', async () => {
    ;(window as any).api.tasks.getById = vi.fn().mockResolvedValue(null)
    const repo = new TaskRepositoryImpl()
    const res = await repo.getTaskById('missing')
    expect(res).toBeNull()
  })

  it('updateTask calls update and returns mapped domain', async () => {
    const updatedDto: TaskDTO = { id: '1', title: 'Updated', projectId: null, duration: 10, startTime: null, endTime: null, status: 'pending', createdAt: '', updatedAt: '' }
    ;(window as any).api.tasks.update = vi.fn().mockResolvedValue(updatedDto)

    const repo = new TaskRepositoryImpl()
    const res = await repo.updateTask('1', { title: 'Updated' })

    expect((window as any).api.tasks.update).toHaveBeenCalled()
    expect(res.id).toBe('1')
    expect(res.title).toBe('Updated')
  })

  it('deleteTask proxies to api.delete', async () => {
    ;(window as any).api.tasks.delete = vi.fn().mockResolvedValue(true)
    const repo = new TaskRepositoryImpl()
    await repo.deleteTask('1')
    expect((window as any).api.tasks.delete).toHaveBeenCalledWith('1')
  })
})
