import React from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/ui/dialog'
import { NativeSelect, NativeSelectOption } from '@/shared/components/ui/native-select'
import { Label } from '@/shared/components/ui/label'
import { Project } from '../../domain/models/Project'
import { observer } from 'mobx-react-lite'
import { ProjectFormViewModel, ProjectFormClientOption } from '../viewmodels/ProjectFormViewModel'
import { useLocalObservable } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

export interface ProjectFormProps {
  initial?: Partial<Project>
  open: boolean
  onClose: () => void
  onSubmit: (project: Project) => void
  clients?: ProjectFormClientOption[]
}

export const ProjectForm: React.FC<ProjectFormProps> = observer(
  ({ initial = {}, open, onClose, onSubmit, clients = [] }) => {
    const { t } = useTranslation()
    const vm = useLocalObservable(() => new ProjectFormViewModel(initial, clients))

    React.useEffect(() => {
      if (open) {
        vm.setInitial(initial, clients)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initial, clients])

    function handleSubmit(e?: React.FormEvent) {
      e?.preventDefault()
      onSubmit(vm.project)
      onClose()
    }

    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initial.id ? t('projects.editProject') : t('projects.createProject')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">{t('projects.name')}</label>
              <Input value={vm.name} onChange={(e) => vm.setName(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="client" className="text-sm text-muted-foreground">
                {t('projects.clientOptional')}
              </Label>
              <NativeSelect
                id="client"
                className="w-full"
                value={vm.clientId}
                onChange={(e) => vm.setClientId(e.target.value)}
              >
                <NativeSelectOption value="">{t('projects.noClient')}</NativeSelectOption>
                {clients.map((c) => (
                  <NativeSelectOption key={c.id} value={c.id}>
                    {c.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">{t('projects.rateLabel')}</label>
              <Input value={vm.rate} onChange={(e) => vm.setRate(e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">{t('projects.color')}</label>
              <Input
                value={vm.color}
                onChange={(e) => vm.setColor(e.target.value)}
                placeholder="#1f2937"
              />
            </div>

            <DialogFooter>
              <Button type="submit">{t('projects.save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
)
