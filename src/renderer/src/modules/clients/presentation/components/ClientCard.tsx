import React from 'react'
import { LucideUsers } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Link } from 'wouter'
import { ClientModal } from './ClientModal'
import { useTranslation } from 'react-i18next'
import { useInjection } from '@/shared/hooks/useInjection'
import { ClientsViewModel } from '../viewmodels/ClientsViewModel'
import type { Client } from '../../domain/models/Client'

type Props = {
  client: Client
}

export const ClientCard: React.FC<Props> = ({ client }) => {
  const vm = useInjection<ClientsViewModel>(ClientsViewModel)
  const { t } = useTranslation()

  return (
    <Link href={`/clients/${client.id}`}>
      <a className="block no-underline">
        <Card className="w-full md:w-80 rounded-lg border-border/40 hover:border-border/60 transition-colors">
          <CardContent className="flex items-start gap-4 p-6">
        <div className="shrink-0 bg-primary/10 rounded-md p-3 ring-1 ring-primary/10">
          <div className="w-8 h-8 rounded-md bg-primary-90 flex items-center justify-center text-primary-foreground">
            <LucideUsers className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              <span className="cursor-pointer hover:underline">{client.name}</span>
            </h3>
            <div className="flex items-center gap-2">
              <ClientModal client={client}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('clients.edit')}
                </button>
              </ClientModal>
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const confirmed = window.confirm(t('clients.confirmDelete', { name: client.name }))
                  if (!confirmed) return
                  try {
                    await vm.deleteClient(client.id)
                  } catch (err) {
                    console.error('Delete failed', err)
                  }
                }}
                className="text-sm text-destructive hover:text-destructive/80"
              >
                {t('clients.delete')}
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2">{t('clients.email')}: <span className="font-medium text-foreground">{client.email}</span></p>
          <p className="text-sm text-muted-foreground mt-1">{t('clients.projects')}: <span className="font-medium">0</span></p>
        </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  )
}

export default ClientCard
