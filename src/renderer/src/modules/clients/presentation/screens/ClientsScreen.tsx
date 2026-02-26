import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { LucideSearch, LucideUsers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useInjection } from '@/shared/hooks/useInjection'
 
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import { ClientsViewModel } from '../viewmodels/ClientsViewModel'
import { ClientCard } from '../components/ClientCard'
import { ClientModal } from '../components/ClientModal'

export const ClientsScreen = observer(() => {
  const vm = useInjection<ClientsViewModel>(ClientsViewModel)
  const { t } = useTranslation()

  useEffect(() => {
    vm.loadClients()
  }, [vm])

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t('clients.title')}</h1>
          <p className="text-sm text-muted-foreground font-medium opacity-80">{t('clients.subtitle')}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('clients.search')}
              className="pl-9 bg-card/40 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <ClientModal />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:px-8 max-w-7xl mx-auto w-full flex flex-col">
        {vm.loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
            {t('clients.loading')}
          </div>
        ) : vm.clients.length === 0 ? (
          <Card className="border-dashed border-2 bg-card/10 border-border/40 min-h-[400px] flex items-center justify-center transition-all hover:border-border/60">
            <CardContent className="flex flex-col items-center justify-center p-0 space-y-6">
              <div className="bg-muted/20 p-5 rounded-full ring-8 ring-muted/5">
                <LucideUsers className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground font-medium text-lg">{t('clients.emptyTitle')}</p>
                <ClientModal>
                  <button className="text-primary hover:text-primary/80 transition-colors font-semibold group flex items-center gap-2 mx-auto cursor-pointer">
                    {t('clients.emptyAction')}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </ClientModal>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {vm.clients.map((c) => (
              <div key={c.id} className="max-w-xs">
                <ClientCard client={c} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
})
