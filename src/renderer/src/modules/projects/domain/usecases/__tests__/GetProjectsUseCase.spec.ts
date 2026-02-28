import { describe, it, expect, vi } from 'vitest'
import { GetProjectsUseCase } from '../GetProjectsUseCase'
import { ProjectRepository } from '@/modules/projects/domain/repositories/ProjectRepository'
import { Project } from '@/modules/projects/domain/models/Project'

describe('GetProjectsUseCase', () => {
  it('returns projects from repository', async () => {
    const projects: Project[] = [{ id: 'p1', name: 'P1' } as Project]
    const repo: Partial<ProjectRepository> = { getProjects: vi.fn().mockResolvedValue(projects) }

    const uc = new GetProjectsUseCase(repo as ProjectRepository)
    const result = await uc.execute()
    expect(repo.getProjects).toHaveBeenCalled()
    expect(result).toBe(projects)
  })
})
