import React, { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog'
import { NativeSelect, NativeSelectOption } from '@/shared/components/ui/native-select'
import { Label } from '@/shared/components/ui/label'
import { useInjection } from '@/shared/hooks/useInjection'
import { ClientsViewModel } from '@/modules/clients/presentation/viewmodels/ClientsViewModel'
import { Project } from '../../domain/models/Project'

export const ProjectForm: React.FC<{
  initial?: Partial<Project>
  open: boolean
  onClose: () => void
  onSubmit: (project: Project) => void
}> = ({ initial = {}, open, onClose, onSubmit }) => {
  const [name, setName] = useState(initial.name ?? '')
  const [clientId, setClientId] = useState<string>(initial.clientId ?? '')
  const [rate, setRate] = useState(String(initial.rate ?? ''))
  const [color, setColor] = useState(initial.color ?? '')

  const clientsVm = useInjection<ClientsViewModel>(ClientsViewModel)

  useEffect(() => {
    if (open) {
      clientsVm.loadClients()
      setClientId(initial.clientId ?? '')
      setName(initial.name ?? '')
      setRate(String(initial.rate ?? ''))
      setColor(initial.color ?? '')
    }
  }, [open, clientsVm, initial])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const project: Project = {
      id: initial.id ?? `${Date.now()}`,
      name: name.trim() || 'Untitled',
      clientId: clientId || initial.clientId,
      color: color || undefined,
      rate: rate ? Number(rate) : undefined
    }
    onSubmit(project)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial.id ? 'Editar proyecto' : 'Nuevo proyecto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="client" className="text-sm text-muted-foreground">Cliente (opcional)</Label>
            <NativeSelect id="client" className="w-full" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <NativeSelectOption value="">Sin cliente</NativeSelectOption>
              {clientsVm.clients.map((c) => (
                <NativeSelectOption key={c.id} value={c.id}>
                  {c.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Tarifa (USD/h)</label>
            <Input value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Color</label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#1f2937" />
          </div>

          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
