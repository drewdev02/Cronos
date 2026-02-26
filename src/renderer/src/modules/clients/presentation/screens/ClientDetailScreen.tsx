import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams, Link } from 'wouter'
import { LucideArrowLeft } from 'lucide-react'
import { useInjection } from '@/shared/hooks/useInjection'
import { Button } from '@/shared/components/ui/button'
import { ClientDetailViewModel } from '../viewmodels/ClientDetailViewModel'
import { Card, CardContent } from '@/shared/components/ui/card'

export const ClientDetailScreen = observer(() => {
  const params = useParams<{ id: string }>()
  const id = params.id
  const vm = useInjection<ClientDetailViewModel>(ClientDetailViewModel)

  useEffect(() => {
    if (id) vm.loadClient(id)
  }, [id, vm])

  if (vm.loading) return <div className="p-6">Cargando cliente...</div>
  if (vm.error) return <div className="p-6 text-red-500">{vm.error}</div>
  if (!vm.client) return <div className="p-6">Cliente no encontrado</div>

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-6 md:px-8 flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <LucideArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{vm.client.name}</h1>
          <p className="text-sm text-muted-foreground font-medium opacity-80">Detalle del cliente</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:px-8 max-w-4xl mx-auto w-full">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">{vm.client.name}</h2>
            <p className="text-sm text-muted-foreground mt-2">{vm.client.email}</p>
            <div className="mt-4 text-sm text-muted-foreground">Proyectos: 0</div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
})

export default ClientDetailScreen
