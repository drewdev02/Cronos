import { describe, it, expect, vi } from 'vitest'
import { DeleteProjectUseCase } from '../DeleteProjectUseCase'
import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository'

describe('DeleteProjectUseCase', () => {
  it('forwards delete to repository and returns boolean', async () => {
    const repo: Partial<ProjectRepository> = { deleteProject: vi.fn().mockResolvedValue(true) }

    const uc = new DeleteProjectUseCase(repo as ProjectRepository)
    const result = await uc.execute('p1')
    expect(repo.deleteProject).toHaveBeenCalledWith('p1')
    expect(result).toBe(true)
  })
})
