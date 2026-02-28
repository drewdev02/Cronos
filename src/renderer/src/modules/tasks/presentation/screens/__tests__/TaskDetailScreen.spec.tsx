import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { container } from '@/shared/di/container'
import i18n from '@/shared/i18n'
import '@/shared/i18n'
import { TaskDetailScreen } from '../TaskDetailScreen'
import { TaskDetailViewModel } from '../../viewmodels/TaskDetailViewModel'

describe('TaskDetailScreen (UI)', () => {
  it('renders task details when vm has task', () => {
    const mockVm = {
      loading: false,
      error: null,
      task: {
        id: 't1',
        title: 'Detail Task',
        duration: 90,
        status: 'completed',
        projectId: 'p1',
        currentDuration: 90
      },
      moneyGenerated: 12.5,
      projectRate: 10,
      loadTask: vi.fn()
    } as unknown as TaskDetailViewModel

    if (container.isBound(TaskDetailViewModel)) container.unbind(TaskDetailViewModel)
    container.bind(TaskDetailViewModel).toConstantValue(mockVm)

    render(<TaskDetailScreen />)

    expect(screen.getByText('Detail Task')).toBeDefined()
    // Time formatted should appear
    expect(screen.getByText('00:01:30')).toBeDefined()
    // Money generated displayed
    expect(screen.getByText(`$${mockVm.moneyGenerated.toFixed(2)}`)).toBeDefined()
    // Project rate text
    expect(screen.getByText(i18n.t('tasks.generatedAtRate', { rate: mockVm.projectRate.toFixed(2) }))).toBeDefined()
  })
})
