import { describe, it, expect, vi } from 'vitest'
import { ProjectsViewModel } from '../ProjectsViewModel'
import { GetProjectsUseCase } from '@/modules/projects/domain/usecases/GetProjectsUseCase'
import { CreateProjectUseCase } from '@/modules/projects/domain/usecases/CreateProjectUseCase'
import { UpdateProjectUseCase } from '@/modules/projects/domain/usecases/UpdateProjectUseCase'
import { DeleteProjectUseCase } from '@/modules/projects/domain/usecases/DeleteProjectUseCase'
import { Project } from '@/modules/projects/domain/models/Project'

describe('ProjectsViewModel', () => {
  it('sets loading true while loading projects then false and populates projects', async () => {
    const projects: Project[] = [{ id: 'p1', name: 'P1', rate: 10 } as Project]
    const mockGet = { execute: vi.fn().mockResolvedValue(projects) } as unknown as GetProjectsUseCase

    const vm = new ProjectsViewModel(mockGet, {} as unknown as CreateProjectUseCase, {} as unknown as UpdateProjectUseCase, {} as unknown as DeleteProjectUseCase)

    const promise = vm.loadProjects()
    expect(vm.loading).toBe(true)
    await promise
    expect(vm.loading).toBe(false)
    expect(vm.projects).toHaveLength(1)
    expect(vm.projects[0].id).toBe('p1')
  })

  it('createProject calls usecase and reloads projects', async () => {
    const created: Project = { id: 'p2', name: 'New' } as Project
    const projectsAfter: Project[] = [created]

    const mockGet = { execute: vi.fn().mockResolvedValue(projectsAfter) } as unknown as GetProjectsUseCase
    const mockCreate = { execute: vi.fn().mockResolvedValue(created) } as unknown as CreateProjectUseCase

    const vm = new ProjectsViewModel(mockGet, mockCreate, {} as unknown as UpdateProjectUseCase, {} as unknown as DeleteProjectUseCase)

    await vm.createProject(created)
    expect(mockCreate.execute).toHaveBeenCalledWith(created)
    expect(vm.projects).toHaveLength(1)
    expect(vm.projects[0].id).toBe('p2')
  })

  it('updateProject calls usecase and reloads projects', async () => {
    const updated: Project = { id: 'p3', name: 'Updated' } as Project
    const projectsAfter: Project[] = [updated]

    const mockGet = { execute: vi.fn().mockResolvedValue(projectsAfter) } as unknown as GetProjectsUseCase
    const mockUpdate = { execute: vi.fn().mockResolvedValue(updated) } as unknown as UpdateProjectUseCase

    const vm = new ProjectsViewModel(mockGet, {} as unknown as CreateProjectUseCase, mockUpdate, {} as unknown as DeleteProjectUseCase)

    await vm.updateProject('p3', { name: 'Updated' })
    expect(mockUpdate.execute).toHaveBeenCalledWith('p3', { name: 'Updated' })
    expect(vm.projects[0].id).toBe('p3')
  })

  it('deleteProject calls usecase and reloads projects', async () => {
    const projectsAfter: Project[] = []
    const mockGet = { execute: vi.fn().mockResolvedValue(projectsAfter) } as unknown as GetProjectsUseCase
    const mockDelete = { execute: vi.fn().mockResolvedValue(true) } as unknown as DeleteProjectUseCase

    const vm = new ProjectsViewModel(mockGet, {} as unknown as CreateProjectUseCase, {} as unknown as UpdateProjectUseCase, mockDelete)

    await vm.deleteProject('p4')
    expect(mockDelete.execute).toHaveBeenCalledWith('p4')
    expect(vm.projects).toHaveLength(0)
  })
})
