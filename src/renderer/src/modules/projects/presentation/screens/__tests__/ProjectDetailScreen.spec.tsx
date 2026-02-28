import { ProjectDetailViewModel } from '../../viewmodels/ProjectDetailViewModel'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { container } from '@/shared/di/container'
import i18n from '@/shared/i18n'
import '@/shared/i18n'
import { ProjectDetailScreen } from '../ProjectDetailScreen'


// Minimal interface for test mocks (public API only)
interface ProjectDetailViewModelLike {
  loading: boolean
  project: any
  tasks: any[]
  totalEarned: number
  loadProject: (...args: any[]) => void
}

function createMockViewModel(
  params: Partial<Pick<ProjectDetailViewModelLike, 'loading' | 'project' | 'tasks'>> = {}
): ProjectDetailViewModelLike {
  const { loading = false, project = null, tasks = [] } = params
  return {
    loading,
    project,
    tasks,
    totalEarned: project?.totalEarned ?? 0,
    loadProject: vi.fn()
  }
}

describe('ProjectDetailScreen (UI)', () => {
  it('muestra loading', () => {
    const vm = createMockViewModel({ loading: true })
    if (container.isBound(ProjectDetailViewModel)) container.unbind(ProjectDetailViewModel)
    container.bind(ProjectDetailViewModel).toConstantValue(vm)
    render(<ProjectDetailScreen />)
    expect(screen.getByText((content) => content.toLowerCase().includes('loading'))).toBeDefined()
  })

  it('muestra not found', () => {
    const vm = createMockViewModel({ loading: false, project: null })
    if (container.isBound(ProjectDetailViewModel)) container.unbind(ProjectDetailViewModel)
    container.bind(ProjectDetailViewModel).toConstantValue(vm)
    render(<ProjectDetailScreen />)
    // Puede renderizar la clave de traducción si i18n no está inicializado en test
    expect(
      screen.getByText(
        (content) => content.toLowerCase().includes('not found') || content === 'projects.notFound'
      )
    ).toBeDefined()
  })

  it('muestra datos del proyecto y tareas', () => {
    const vm = createMockViewModel({
      loading: false,
      project: {
        id: '1',
        name: 'Test Project',
        client: { id: 'c1', name: 'ClientX' },
        rate: 10,
        totalEarned: 100
      },
      tasks: [
        {
          id: 't1',
          title: 'Task 1',
          duration: 2,
          endTime: new Date(),
          projectId: '1',
          status: 'completed'
        },
        {
          id: 't2',
          title: 'Task 2',
          duration: 3,
          endTime: undefined,
          projectId: '1',
          status: 'pending'
        }
      ]
    })
    if (container.isBound(ProjectDetailViewModel)) container.unbind(ProjectDetailViewModel)
    container.bind(ProjectDetailViewModel).toConstantValue(vm)
    render(<ProjectDetailScreen />)
    expect(screen.getByText(/test project/i)).toBeDefined()
    expect(screen.getByText(/clientx/i)).toBeDefined()
    expect(
      screen.getByText((content) => content.toLowerCase().includes('total earned'))
    ).toBeDefined()
    expect(screen.getByText(/task 1/i)).toBeDefined()
    expect(screen.getByText(/task 2/i)).toBeDefined()
  })

  it('muestra mensaje si no hay tareas', () => {
    const vm = createMockViewModel({
      loading: false,
      project: {
        id: '1',
        name: 'Test Project',
        client: { id: 'c1', name: 'ClientX' },
        rate: 10,
        totalEarned: 0
      },
      tasks: []
    })
    if (container.isBound(ProjectDetailViewModel)) container.unbind(ProjectDetailViewModel)
    container.bind(ProjectDetailViewModel).toConstantValue(vm)
    render(<ProjectDetailScreen />)
    expect(screen.getByText(i18n.t('projects.noTasks'))).toBeDefined()
  })
})
