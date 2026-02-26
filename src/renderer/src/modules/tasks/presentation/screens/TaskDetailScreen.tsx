import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams, Link } from 'wouter'
import { LucideArrowLeft, LucideClock, LucideDollarSign } from 'lucide-react'
import { useInjection } from '@/shared/hooks/useInjection'
import { Button } from '@/shared/components/ui/button'
import { TaskDetailViewModel } from '../viewmodels/TaskDetailViewModel'

export const TaskDetailScreen = observer(() => {
  const { id } = useParams<{ id: string }>()
  const vm = useInjection<TaskDetailViewModel>(TaskDetailViewModel)

  useEffect(() => {
    if (id) {
      vm.loadTask(id)
    }
  }, [id, vm])

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (vm.loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-muted-foreground animate-pulse">
        Cargando tarea...
      </div>
    )
  }

  if (vm.error || !vm.task) {
    return (
      <div className="flex-1 p-6 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center mb-6">
          <Link href="/tasks">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <LucideArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
        <div className="text-center text-destructive">{vm.error || 'Tarea no encontrada'}</div>
      </div>
    )
  }

  const { task } = vm

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/tasks">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <LucideArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <p className="text-sm text-muted-foreground font-medium opacity-80">
              Detalles de la tarea
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Informacion basica */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">
              Información de la Tarea
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground block">ID</span>
                <span className="font-mono text-sm">{task.id}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">ID Proyecto</span>
                <span className="font-mono text-sm">{task.projectId || 'Sin proyecto'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Estado</span>
                <span className="capitalize">{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Tiempo */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 flex flex-col items-center justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <LucideClock className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold tracking-tight text-primary">
                {formatTime(task.currentDuration ?? task.duration)}
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                Tiempo total registrado
              </div>
            </div>
          </div>

          {/* Dinero Generado */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 flex flex-col items-center justify-center">
            <div className="bg-green-500/10 p-4 rounded-full">
              <LucideDollarSign className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold tracking-tight text-green-500">
                ${vm.moneyGenerated.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground font-medium mt-1">
                {vm.projectRate > 0
                  ? `Dinero generado a $${vm.projectRate.toFixed(2)}/h`
                  : 'Sin tarifa / proyecto'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})
