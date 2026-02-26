import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import {
  LucideDollarSign,
  LucideClock,
  LucideBriefcase,
  LucideSearch,
  LucidePlus
} from 'lucide-react'
import { useInjection } from '@/shared/hooks/useInjection'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { DashboardViewModel } from '../viewmodels/DashboardViewModel'
import { StatCard } from '../components/StatCard'
import { RecentTasks } from '../components/RecentTasks'

export const DashboardScreen = observer(() => {
  const vm = useInjection<DashboardViewModel>(DashboardViewModel)
  const { t } = useTranslation()

  useEffect(() => {
    vm.loadStats()
  }, [vm])

  if (vm.loading && !vm.stats) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground">
        {t('dashboard.loading')}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('dashboard.search')}
              className="pl-9 bg-card/40 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <Button className="bg-primary text-primary-foreground font-semibold flex items-center gap-2 px-4 shadow-lg shadow-primary/20">
            <LucidePlus className="w-4 h-4" />
            {t('dashboard.newTask')}
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <main className="flex-1 p-6 md:px-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title={t('dashboard.totalEarned')}
            value={`$${vm.stats?.totalEarned.toFixed(2) || '0.00'}`}
            icon={LucideDollarSign}
            iconColor="text-emerald-500"
          />
          <StatCard
            title={t('dashboard.totalTime')}
            value={vm.stats?.totalTime || '00:00:00'}
            icon={LucideClock}
            iconColor="text-sky-500"
          />
          <StatCard
            title={t('dashboard.activeProjects')}
            value={vm.stats?.activeProjects.toString() || '0'}
            icon={LucideBriefcase}
            iconColor="text-blue-600"
          />
        </div>

        {/* Recent Tasks */}
        <RecentTasks />
      </main>
    </div>
  )
})
