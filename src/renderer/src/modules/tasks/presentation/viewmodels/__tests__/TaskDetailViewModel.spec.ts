import { describe, it, expect, vi } from 'vitest'
import { TaskDetailViewModel } from '../TaskDetailViewModel'
import { GetTaskByIdUseCase } from '../../domain/usecases/GetTaskByIdUseCase'
import { CalculateTaskEarningsUseCase } from '../../domain/usecases/CalculateTaskEarningsUseCase'
import { Task } from '../../domain/models/Task'

describe('TaskDetailViewModel', () => {
  it('loads task and sets zeros when not found', async () => {
    const mockGet = { execute: vi.fn().mockResolvedValue(null) } as unknown as GetTaskByIdUseCase
    const mockCalc = { execute: vi.fn() } as unknown as CalculateTaskEarningsUseCase
    const vm = new TaskDetailViewModel(mockGet, mockCalc)

    const promise = vm.loadTask('missing')
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.task).toBeNull()
    expect(vm.moneyGenerated).toBe(0)
    expect(vm.projectRate).toBe(0)
  })

  it('sets task and money when found', async () => {
    const task: Task = { id: '1', title: 'T', duration: 0, status: 'pending' } as Task
    const mockGet = { execute: vi.fn().mockResolvedValue(task) } as unknown as GetTaskByIdUseCase
    const mockCalc = { execute: vi.fn().mockResolvedValue({ earnings: 5, rate: 20 }) } as unknown as CalculateTaskEarningsUseCase
    const vm = new TaskDetailViewModel(mockGet, mockCalc)

    await vm.loadTask('1')
    expect(vm.task).toEqual(task)
    expect(vm.moneyGenerated).toBe(5)
    expect(vm.projectRate).toBe(20)
  })
})
