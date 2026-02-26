import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { LucidePlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useInjection } from '@/shared/hooks/useInjection'
import { NativeSelect, NativeSelectOption } from '@/shared/components/ui/native-select'
import { TasksViewModel } from '../viewmodels/TasksViewModel'
import { ProjectsViewModel } from '@/modules/projects/presentation/viewmodels/ProjectsViewModel'
import { Task } from '../../domain/models/Task'

interface TaskModalProps {
  children?: React.ReactNode
  task?: Task
}

export const TaskModal = observer(({ children, task }: TaskModalProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(task?.title || '')
  const [projectId, setProjectId] = useState<string>(task?.projectId || '')
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const tasksVm = useInjection<TasksViewModel>(TasksViewModel)
  const projectsVm = useInjection<ProjectsViewModel>(ProjectsViewModel)

  useEffect(() => {
    if (open) {
      projectsVm.loadProjects()
      if (task) {
        setTitle(task.title)
        setProjectId(task.projectId || '')
        const d = task.duration
        setHours(Math.floor(d / 3600))
        setMinutes(Math.floor((d % 3600) / 60))
        setSeconds(d % 60)
      } else {
        setTitle('')
        setProjectId('')
        setHours(0)
        setMinutes(0)
        setSeconds(0)
      }
    }
  }, [open, projectsVm, task])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!title.trim()) return

    const totalSeconds = hours * 3600 + minutes * 60 + seconds

    if (task) {
      await tasksVm.updateTask(task.id, {
        title,
        projectId: projectId || undefined,
        duration: totalSeconds
      })
    } else {
      await tasksVm.createTask(title, projectId || undefined)
      // Note: createTask in VM currently hardcodes 0 duration,
      // but if we wanted to support initial duration we'd change it there too.
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 px-4 shadow-lg shadow-primary/20 transition-all active:scale-95 shadow-2xl">
            <LucidePlus className="w-4 h-4" />
            Nuevo task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Task' : 'Crear Nuevo Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="¿En qué vas a trabajar?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project">Proyecto (Opcional)</Label>
            <NativeSelect
              id="project"
              className="w-full"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <NativeSelectOption value="">Sin proyecto</NativeSelectOption>
              {projectsVm.projects.map((p) => (
                <NativeSelectOption key={p.id} value={p.id}>
                  {p.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Tiempo (HH:MM:SS)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Input
                  type="number"
                  min={0}
                  placeholder="HH"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-1">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="MM"
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                />
              </div>
              <div className="space-y-1">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="SS"
                  value={seconds}
                  onChange={(e) =>
                    setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={tasksVm.loading || !title.trim()} className="w-full">
              {tasksVm.loading
                ? task
                  ? 'Guardando...'
                  : 'Creando...'
                : task
                  ? 'Guardar Cambios'
                  : 'Crear Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})
