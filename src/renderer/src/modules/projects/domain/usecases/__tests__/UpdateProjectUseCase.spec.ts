import { describe, it, expect, vi } from 'vitest'
import { UpdateProjectUseCase } from '../UpdateProjectUseCase'
import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository'
import { Project } from '@/modules/projects/domain/models/Project'

describe('UpdateProjectUseCase', () => {
  it('forwards update to repository and returns updated project', async () => {
    const updated: Project = { id: 'p1', name: 'Updated' } as Project
    const repo: Partial<ProjectRepository> = { updateProject: vi.fn().mockResolvedValue(updated) }

    const uc = new UpdateProjectUseCase(repo as ProjectRepository)
    const result = await uc.execute('p1', { name: 'Updated' })
    expect(repo.updateProject).toHaveBeenCalledWith('p1', { name: 'Updated' })
    expect(result).toBe(updated)
  })
})
