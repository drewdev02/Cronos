import { describe, it, expect } from 'vitest'
import { TaskMapper } from '../../mappers/TaskMapper'
import { Task } from '../../domain/models/Task'
import { TaskDTO } from '@/../../shared/types'

describe('TaskMapper', () => {
  it('maps DTO to domain and parses dates', () => {
    const dto: TaskDTO = {
      id: 't1',
      title: 'Task',
      projectId: null,
      duration: 120,
      startTime: '2020-01-01T00:00:00.000Z',
      endTime: '2020-01-01T00:02:00.000Z',
      status: 'pending',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: ''
    }

    const domain = TaskMapper.toDomain(dto)

    expect(domain.id).toBe('t1')
    expect(domain.title).toBe('Task')
    expect(domain.projectId).toBeUndefined()
    expect(domain.startTime).toBeInstanceOf(Date)
    expect(domain.endTime).toBeInstanceOf(Date)
    expect(domain.createdAt).toBeInstanceOf(Date)
  })

  it('maps domain to DTO and normalizes nulls/strings', () => {
    const domain: Omit<Task, 'id'> = {
      title: 'T2',
      projectId: undefined,
      duration: 0,
      startTime: undefined,
      endTime: undefined,
      status: 'pending'
    }

    const dto = TaskMapper.toDTO(domain)

    expect(dto.title).toBe('T2')
    expect(dto.projectId).toBeNull()
    expect(dto.startTime).toBeNull()
    expect(dto.endTime).toBeNull()
    expect(dto.status).toBe('pending')
  })
})
