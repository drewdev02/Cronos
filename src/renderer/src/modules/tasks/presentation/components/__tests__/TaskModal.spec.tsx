import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { container } from '@/shared/di/container'
import i18n from '@/shared/i18n'
import '@/shared/i18n'
import { TaskModal } from '../TaskModal'
import { TasksViewModel } from '../../viewmodels/TasksViewModel'

describe('TaskModal (UI)', () => {
  it('opens dialog and submits create task', async () => {
    const mockCreate = vi.fn().mockResolvedValue({ id: 'new' })
    const mockTasksVm = {
      loading: false,
      createTask: mockCreate
    } as unknown as TasksViewModel

    // mock projects VM to avoid window.api calls
    const mockProjectsVm = {
      projects: [],
      loading: false,
      loadProjects: vi.fn()
    }

    if (container.isBound(TasksViewModel)) container.unbind(TasksViewModel)
    container.bind(TasksViewModel).toConstantValue(mockTasksVm)

    const { ProjectsViewModel } = await import('@/modules/projects/presentation/viewmodels/ProjectsViewModel')
    if (container.isBound(ProjectsViewModel)) container.unbind(ProjectsViewModel)
    container.bind(ProjectsViewModel).toConstantValue(mockProjectsVm as any)

    render(<TaskModal />)

    const trigger = screen.getByText(i18n.t('tasks.newTask'))
    expect(trigger).toBeDefined()
    fireEvent.click(trigger)

    // wait for dialog to open and show title input
    await waitFor(() => {
      expect(screen.getByPlaceholderText(i18n.t('tasks.placeholderTitle'))).toBeDefined()
    })

    const input = screen.getByPlaceholderText(i18n.t('tasks.placeholderTitle'))
    fireEvent.change(input, { target: { value: 'Created Task' } })

    const submit = screen.getByRole('button', { name: i18n.t('tasks.createTask') })
    fireEvent.click(submit)

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled()
    })
  })
})
