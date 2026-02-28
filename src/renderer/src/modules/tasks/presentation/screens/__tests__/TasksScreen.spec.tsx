import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { container } from '@/shared/di/container'
import i18n from '@/shared/i18n'
import '@/shared/i18n'
import { TasksScreen } from '../TasksScreen'
import { TasksViewModel } from '../../viewmodels/TasksViewModel'
import { Router } from 'wouter'

describe('TasksScreen (UI)', () => {
  it('shows empty state when there are no tasks', async () => {
    const mockVm = {
      loading: false,
      tasks: [],
      tasksWithProject: [],
      loadTasks: vi.fn(),
      toggleTask: vi.fn(),
      deleteTask: vi.fn()
    } as unknown as TasksViewModel

    const mockProjectsVm = {
      projects: [],
      loading: false,
      loadProjects: vi.fn()
    }

    if (container.isBound(TasksViewModel)) {
      container.unbind(TasksViewModel)
    }
    container.bind(TasksViewModel).toConstantValue(mockVm)

    // prevent real API calls from Projects repository by binding a mock
    const { ProjectsViewModel } = await import('@/modules/projects/presentation/viewmodels/ProjectsViewModel')
    if (container.isBound(ProjectsViewModel)) {
      container.unbind(ProjectsViewModel)
    }
    container.bind(ProjectsViewModel).toConstantValue(mockProjectsVm as any)

    render(
      <Router>
        <TasksScreen />
      </Router>
    )

    expect(screen.getByText(i18n.t('tasks.emptyTitle'))).toBeDefined()
    expect(mockVm.loadTasks).toHaveBeenCalled()
  })

  it('renders a task card and toggles task when play/pause clicked', async () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      duration: 60,
      status: 'pending',
      projectName: 'P1',
      currentDuration: 60,
      createdAt: new Date().toISOString()
    }

    const mockVm = {
      loading: false,
      tasks: [task],
      tasksWithProject: [task],
      loadTasks: vi.fn(),
      toggleTask: vi.fn(),
      deleteTask: vi.fn()
    } as unknown as TasksViewModel

    const mockProjectsVm2 = {
      projects: [],
      loading: false,
      loadProjects: vi.fn()
    }

    if (container.isBound(TasksViewModel)) {
      container.unbind(TasksViewModel)
    }
    container.bind(TasksViewModel).toConstantValue(mockVm)

    const { ProjectsViewModel: PV2 } = await import('@/modules/projects/presentation/viewmodels/ProjectsViewModel')
    if (container.isBound(PV2)) {
      container.unbind(PV2)
    }
    container.bind(PV2).toConstantValue(mockProjectsVm2 as any)

    render(
      <Router>
        <TasksScreen />
      </Router>
    )

    expect(screen.getByText('Test Task')).toBeDefined()

    const playSvg = document.querySelector('svg.lucide-play')
    expect(playSvg).toBeTruthy()
    const playBtn = playSvg?.closest('button')
    expect(playBtn).toBeTruthy()
    if (playBtn) fireEvent.click(playBtn)

    expect(mockVm.toggleTask).toHaveBeenCalled()
  })
})
