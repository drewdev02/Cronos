import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useLocation } from 'wouter'
import { useInjection } from '@/shared/hooks/useInjection'
import { TasksViewModel } from '@/modules/tasks/presentation/viewmodels/TasksViewModel'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

function formatDuration(totalSeconds: number) {
  const sec = totalSeconds % 60
  const min = Math.floor((totalSeconds / 60) % 60)
  const hrs = Math.floor(totalSeconds / 3600)
  return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export const RecentTasks = observer(function RecentTasks() {
  const vm = useInjection<TasksViewModel>(TasksViewModel)
  const [, navigate] = useLocation()

  useEffect(() => {
    vm.loadTasks()
  }, [vm])

  const items = vm.tasks
    .slice()
    .sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return tb - ta
    })
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-semibold text-foreground">Tareas Recientes</h2>
        <Button variant="link" className="text-sm" onClick={() => navigate('/tasks')}>
          Ver todas
        </Button>
      </div>

      {vm.loading && items.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent border-border/40 min-h-50 flex items-center justify-center">
          <CardContent className="p-0 text-muted-foreground font-medium">Cargando...</CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent border-border/40 min-h-50 flex items-center justify-center">
          <CardContent className="p-0 text-muted-foreground font-medium">No hay tareas registradas aún.</CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <Card key={t.id} className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.projectId ? t.projectId : 'Sin proyecto'}</div>
                </div>
                <div className="text-sm text-muted-foreground">{formatDuration(t.duration || 0)}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
})
