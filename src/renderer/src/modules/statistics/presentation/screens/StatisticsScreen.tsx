import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useInjection } from '@/shared/hooks/useInjection'
import { StatisticsViewModel } from '../viewmodels/StatisticsViewModel'
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/shared/components/ui/chart'
import * as Recharts from 'recharts'

export const StatisticsScreen = observer(() => {
  const vm = useInjection<StatisticsViewModel>(StatisticsViewModel)

  useEffect(() => {
    vm.load()
  }, [vm])

  if (vm.loading && !vm.stats) {
    return <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground">Cargando...</div>
  }

  const earnings = vm.stats?.earningsByClient ?? []
  const timeDist = (vm.stats?.timeDistribution ?? []).map((i) => ({...i, value: i.value /3600 }))
  const trend = vm.stats?.trend ?? []

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      <header className="p-6 md:px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estadísticas</h1>
          <p className="text-sm text-muted-foreground">Resumen de ingresos, tiempo y tendencia</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:px-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-3">Ingresos por Cliente</h3>
            <ChartContainer id="earnings-by-client" config={{ earnings: { color: 'var(--color-earnings,#2b82ff)', label: 'Ingresos' } }} className="h-72">
              <Recharts.BarChart data={earnings}>
                <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Recharts.XAxis dataKey="clientName" tick={{ fill: 'var(--muted-foreground)' }} />
                <Recharts.YAxis tickFormatter={(v) => `$${Number(v).toFixed(0)}`} />
                <Recharts.Tooltip content={<ChartTooltipContent />} />
                <Recharts.Bar dataKey="earned" fill="var(--color-earnings,#2b82ff)" />
              </Recharts.BarChart>
            </ChartContainer>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-3">Distribución de Tiempo</h3>
            <ChartContainer id="time-distribution" config={{ time: { color: 'var(--color-time,#10b981)', label: 'Tiempo' } }} className="h-72">
              <Recharts.PieChart>
                <Recharts.Pie data={timeDist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {timeDist.map((_entry, idx) => (
                    <Recharts.Cell key={`cell-${idx}`} fill={['#2b82ff', '#10b981', '#f59e0b', '#ef4444'][idx % 4]} />
                  ))}
                </Recharts.Pie>
                <Recharts.Tooltip content={<ChartTooltipContent />} />
                <Recharts.Legend content={<ChartLegendContent />} />
              </Recharts.PieChart>
            </ChartContainer>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-3">Tendencia de Ingresos (Últimos 7 días)</h3>
          <ChartContainer id="trend" config={{ trend: { color: 'var(--color-trend,#10b981)', label: 'Ingresos' } }} className="h-96">
            <Recharts.LineChart data={trend}>
              <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Recharts.XAxis dataKey="day" />
              <Recharts.YAxis tickFormatter={(v) => `$${Number(v).toFixed(0)}`} />
              <Recharts.Tooltip content={<ChartTooltipContent />} />
              <Recharts.Line type="monotone" dataKey="earned" stroke="var(--color-trend,#10b981)" strokeWidth={3} dot={{ r: 4 }} />
            </Recharts.LineChart>
          </ChartContainer>
        </div>
      </main>
    </div>
  )
})
