import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { LucideSearch, LucidePlus, LucideBriefcase } from 'lucide-react'
import { useInjection } from '@/shared/hooks/useInjection'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import { ProjectsViewModel } from '../viewmodels/ProjectsViewModel'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectForm } from '../components/ProjectForm'

export const ProjectsScreen = observer(() => {
  const vm = useInjection<ProjectsViewModel>(ProjectsViewModel)
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)

  useEffect(() => {
    vm.loadProjects()
  }, [vm])

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t('projects.title')}</h1>
          <p className="text-sm text-muted-foreground font-medium opacity-80">{t('projects.subtitle')}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('projects.search')}
              className="pl-9 bg-card/40 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 px-4 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <LucidePlus className="w-4 h-4" />
            {t('projects.newProject')}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:px-8 max-w-7xl mx-auto w-full flex flex-col">
        {vm.loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
            {t('projects.loading')}
          </div>
        ) : vm.projects.length === 0 && !vm.loading ? (
          <Card className="border-dashed border-2 bg-card/10 border-border/40 min-h-100 flex items-center justify-center transition-all hover:border-border/60">
            <CardContent className="flex flex-col items-center justify-center p-0 space-y-6">
              <div className="bg-muted/20 p-5 rounded-full ring-8 ring-muted/5">
                <LucideBriefcase className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                  <p className="text-muted-foreground font-medium text-lg">{t('projects.emptyTitle')}</p>
                  <Button
                  variant="ghost"
                  onClick={() => {
                    setEditing(null)
                    setFormOpen(true)
                  }}
                  className="text-primary hover:text-primary/80 transition-colors font-semibold group flex items-center gap-2 mx-auto"
                >
                  {t('projects.emptyAction')}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {vm.projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={() => {
                  setEditing(p.id)
                  setFormOpen(true)
                }}
                onDelete={() => vm.deleteProject(p.id)}
              />
            ))}
          </div>
        )}

        <ProjectForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing ? (vm.projects.find((x) => x.id === editing) ?? undefined) : undefined}
          onSubmit={(project) => {
            if (editing) vm.updateProject(editing, project)
            else vm.createProject(project)
          }}
        />
      </main>
    </div>
  )
})
