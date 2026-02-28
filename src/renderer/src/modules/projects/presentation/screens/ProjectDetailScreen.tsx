import React from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'wouter'
import { useInjection } from '@/shared/hooks/useInjection'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { ProjectDetailViewModel } from '../viewmodels/ProjectDetailViewModel'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table
} from '@/shared/components/ui/table'

export const ProjectDetailScreen = observer(() => {
  const { id } = useParams()
  const vm = useInjection<ProjectDetailViewModel>(ProjectDetailViewModel)
  const { t } = useTranslation()

  React.useEffect(() => {
    if (id) vm.loadProject(id)
  }, [id, vm])

  if (vm.loading) return <div>{t('loading')}</div>
  if (!vm.project) return <div>{t('projects.notFound')}</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-bold mb-2">{vm.project.name}</h2>
        <div className="text-muted-foreground mb-2">
          {t('projects.client')}: <Badge>{vm.project.client?.name ?? '—'}</Badge>
        </div>
        <div className="text-muted-foreground mb-2">
          {t('projects.rate')}: <Badge>${vm.project.rate ?? 0}/h</Badge>
        </div>
        <div className="text-muted-foreground mb-2">
          {t('projects.totalEarned')}:{' '}
          <Badge>
            {typeof vm.project.totalEarned === 'number'
              ? vm.project.totalEarned.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2
                })
              : '$0.00'}
          </Badge>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{t('projects.tasks')}</h3>
        {vm.tasks.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            {t('projects.noTasks') || 'No tasks for this project.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('projects.taskName')}</TableHead>
                <TableHead>{t('projects.earned')}</TableHead>
                <TableHead>{t('projects.completedAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vm.tasks.map((task) => {
                const earned = (task.duration ?? 0) * (vm.project?.rate ?? 0)
                return (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      {earned.toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      {task.endTime ? new Date(task.endTime).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
})
