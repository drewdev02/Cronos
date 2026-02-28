import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { LucidePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import { ClientsViewModel } from '../viewmodels/ClientsViewModel'
import type { Client } from '../../domain/models/Client'

interface Props {
  children?: React.ReactNode
  client?: Client | null
}

export const ClientModal = observer(({ children, client }: Props) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const vm = useInjection<ClientsViewModel>(ClientsViewModel)
  const { t } = useTranslation()

  useEffect(() => {
    if (client && open) {
      setName(client.name)
      setEmail(client.email)
    }
    if (!open) {
      setName('')
      setEmail('')
    }
  }, [client, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    if (client) {
      await vm.updateClient(client.id, { name: name.trim(), email: email.trim() })
    } else {
      await vm.createClient(name.trim(), email.trim())
    }
    setOpen(false)
    setName('')
    setEmail('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2 px-4 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <LucidePlus className="w-4 h-4" />
            {t('clients.newClient')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{client ? t('clients.editClient') : t('clients.createClient')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('clients.name')}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('clients.email')}</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={vm.loading || !name.trim() || !email.trim()} className="w-full">
              {vm.loading ? (client ? t('clients.saving') : t('clients.creating')) : client ? t('clients.saveChanges') : t('clients.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})

export default ClientModal
