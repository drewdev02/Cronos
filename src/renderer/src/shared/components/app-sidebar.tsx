import React from 'react'
import { Briefcase, Clock, LayoutGrid, Users } from 'lucide-react'
import { useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/shared/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/lib/utils'

// Navigation moved inside the component to use the hook

export function AppSidebar(): React.ReactNode {
  const [location, navigate] = useLocation()
  const { t, i18n } = useTranslation()

  const navigation = [
    { name: t('sidebar.dashboard'), href: '/', icon: LayoutGrid },
    { name: t('sidebar.clients'), href: '/clients', icon: Users },
    { name: t('sidebar.projects'), href: '/projects', icon: Briefcase },
    { name: t('sidebar.tasks'), href: '/tasks', icon: Clock }
  ]

  return (
    <Sidebar className="border-r border-white/5 bg-sidebar font-sans">
      <SidebarHeader className="p-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-2.5 flex items-center justify-center shadow-lg ring-1 ring-white/20">
            <Clock className="size-6 text-white stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Chronos</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5">
        <SidebarMenu className="gap-2">
          {navigation.map((item) => {
            const isActive = location === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'transition-all duration-300 group relative h-12 px-4 rounded-xl',
                    isActive
                      ? 'data-[active=true]:bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  )}
                  size="lg"
                >
                  <item.icon
                    className={cn(
                      'size-5 transition-colors duration-300',
                      isActive ? 'text-white' : 'group-hover:text-white'
                    )}
                  />
                  <span className="font-semibold text-[15px]">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-6 mt-auto">
        <SidebarSeparator className="mb-8 opacity-20 bg-zinc-700 mx-2" />

        <div className="flex items-center gap-2 mb-4 px-2">
          <button
            onClick={() => i18n.changeLanguage('es')}
            className={cn(
              'text-xs px-2 py-1 rounded-md transition-colors',
              i18n.resolvedLanguage === 'es'
                ? 'bg-white/10 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            ES
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={cn(
              'text-xs px-2 py-1 rounded-md transition-colors',
              i18n.resolvedLanguage === 'en'
                ? 'bg-white/10 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            EN
          </button>
        </div>

        <div className="flex items-center gap-4 px-2 mb-2">
          <Avatar className="size-11 border border-zinc-800 bg-zinc-900 ring-1 ring-white/5 shadow-inner">
            <AvatarFallback className="bg-zinc-800 text-indigo-400 text-xs font-bold tracking-wider">
              AR
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold text-white truncate leading-tight">
              Freelancer Pro
            </span>
            <span className="text-xs text-zinc-500 truncate font-medium mt-0.5">
              andrey.rgz@gmail.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
