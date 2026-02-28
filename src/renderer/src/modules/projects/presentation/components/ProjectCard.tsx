import React from 'react'
import { useTranslation } from 'react-i18next'
import { Project } from '../../domain/models/Project'
import { Badge } from '@/shared/components/ui/badge'

export const ProjectCard: React.FC<{
  project: Project
  onEdit?: () => void
  onDelete?: () => void
}> = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ background: project.color ?? '#1f2937' }}
        />
        <div>
          <div className="text-lg font-semibold">{project.name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {t('projects.client')}:
            {project.client?.name ? (
              <Badge variant="secondary">{project.client.name}</Badge>
            ) : (
              <Badge variant="outline">—</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          {t('projects.rate')}:<Badge variant="secondary">${project.rate ?? 0}/h</Badge>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-primary hover:underline text-sm font-medium">
            {t('projects.edit')}
          </button>
          <button
            onClick={onDelete}
            className="text-destructive hover:underline text-sm font-medium"
          >
            {t('projects.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
