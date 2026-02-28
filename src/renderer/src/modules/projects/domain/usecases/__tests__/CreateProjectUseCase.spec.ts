import { describe, it, expect, vi } from 'vitest'
import { CreateProjectUseCase } from '../CreateProjectUseCase'
import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository'
import { Project } from '@/modules/projects/domain/models/Project'

describe('CreateProjectUseCase', () => {
  it('forwards creation to repository and returns created project', async () => {
    const project: Project = { id: 'p1', name: 'P1' } as Project
    const repo: Partial<ProjectRepository> = { createProject: vi.fn().mockResolvedValue(project) }

    const uc = new CreateProjectUseCase(repo as ProjectRepository)
    const result = await uc.execute(project)
    expect(repo.createProject).toHaveBeenCalledWith(project)
    expect(result).toBe(project)
  })
})
