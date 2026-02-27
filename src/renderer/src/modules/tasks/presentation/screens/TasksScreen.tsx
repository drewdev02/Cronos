import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'wouter'
import { useTranslation } from 'react-i18next'
import {
  LucideSearch,
  LucideClock,
  LucidePlay,
  LucidePause,
  LucideEdit3,
  LucideTrash2
} from 'lucide-react'
import { useInjection } from '@/shared/hooks/useInjection'
import { formatDate } from '@/shared/lib/formatDate'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { TasksViewModel } from '../viewmodels/TasksViewModel'
import { TaskModal } from '../components/TaskModal'

export const TasksScreen = observer(() => {
  const vm = useInjection<TasksViewModel>(TasksViewModel)
  const { t } = useTranslation()

  useEffect(() => {
    vm.loadTasks()
  }, [vm])

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t('tasks.title')}</h1>
          <p className="text-sm text-muted-foreground font-medium opacity-80">
            {t('tasks.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('tasks.search')}
              className="pl-9 bg-card/40 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <TaskModal />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-4">
        {vm.loading && vm.tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
            {t('tasks.loading')}
          </div>
        ) : vm.tasks.length === 0 ? (
          <Card className="border-dashed border-2 bg-card/10 border-border/40 min-h-100 flex items-center justify-center transition-all hover:border-border/60">
            <CardContent className="flex flex-col items-center justify-center p-0 space-y-6">
              <div className="bg-muted/20 p-5 rounded-full ring-8 ring-muted/5">
                <LucideClock className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground font-medium text-lg">
                  {t('tasks.emptyTitle')}
                </p>
                <TaskModal>
                  <button className="text-primary hover:text-primary/80 transition-colors font-semibold group flex items-center gap-2 mx-auto cursor-pointer">
                    {t('tasks.emptyAction')}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </TaskModal>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {vm.tasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all duration-300 border-l-4 ${
                  task.status === 'in_progress'
                    ? 'border-l-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.01]'
                    : 'border-l-transparent hover:border-l-border'
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-full ${
                        task.status === 'in_progress'
                          ? 'bg-primary/20 animate-pulse'
                          : 'bg-muted/30'
                      }`}
                    >
                      <LucideClock
                        className={`w-5 h-5 ${task.status === 'in_progress' ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                    </div>
                    <Link href={`/tasks/${task.id}`}>
                      <div className="min-w-0 cursor-pointer group">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <span className="truncate">
                            {task.projectId ? t('tasks.project', { id: task.projectId.slice(0, 4) }) : t('tasks.noProject')}
                          </span>
                          {task.createdAt && (
                            <>
                              <span>•</span>
                              <span>{formatDate(task.createdAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-20">
                      <div
                        className={`text-xl font-mono font-bold tracking-tight ${
                          task.status === 'in_progress' ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {formatTime(task.currentDuration ?? task.duration)}
                      </div>
                      <div className="text-[10px] text-primary/80 font-bold">$0.00</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant={task.status === 'in_progress' ? 'default' : 'secondary'}
                        className={`rounded-full w-10 h-10 transition-all ${
                          task.status === 'in_progress'
                            ? 'shadow-lg shadow-primary/20 hover:scale-105'
                            : 'hover:bg-primary/10 hover:text-primary'
                        }`}
                        onClick={() => vm.toggleTask(task)}
                      >
                        {task.status === 'in_progress' ? (
                          <LucidePause className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <LucidePlay className="w-5 h-5 ml-0.5" fill="currentColor" />
                        )}
                      </Button>

                      <TaskModal task={task}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <LucideEdit3 className="w-4 h-4" />
                        </Button>
                      </TaskModal>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-muted-foreground disabled:hover:bg-transparent"
                        onClick={() => vm.deleteTask(task.id)}
                        disabled={task.status === 'in_progress'}
                      >
                        <LucideTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
})
