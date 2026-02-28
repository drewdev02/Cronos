import React from 'react'
import { Route, Switch } from 'wouter'

import { SidebarProvider, SidebarInset } from '@/shared/components/ui/sidebar'
import { AppSidebar } from '@/shared/components/app-sidebar'
import { DashboardScreen } from '@/modules/dashboard/presentation/screens/DashboardScreen'
import { StatisticsScreen } from '@/modules/statistics/presentation/screens/StatisticsScreen'
import { ClientsScreen } from '@/modules/clients/presentation/screens/ClientsScreen'
import { ClientDetailScreen } from '@/modules/clients/presentation/screens/ClientDetailScreen'
import { ProjectsScreen } from '@/modules/projects/presentation/screens/ProjectsScreen'
import { ProjectDetailScreen } from '@/modules/projects/presentation/screens/ProjectDetailScreen'
import { TasksScreen } from '@/modules/tasks/presentation/screens/TasksScreen'
import { TaskDetailScreen } from '@/modules/tasks/presentation/screens/TaskDetailScreen'
import { ChatScreen } from '@/modules/chat/presentation/screens/ChatScreen'

function App(): React.ReactNode {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 h-full overflow-y-auto bg-background selection:bg-blue-500/30">
          <Switch>
            <Route path="/" component={DashboardScreen} />
            <Route path="/clients" component={ClientsScreen} />
            <Route path="/clients/:id" component={ClientDetailScreen} />
            <Route path="/projects" component={ProjectsScreen} />
            <Route path="/projects/:id" component={ProjectDetailScreen} />
            <Route path="/statistics" component={StatisticsScreen} />
            <Route path="/tasks" component={TasksScreen} />
            <Route path="/tasks/:id" component={TaskDetailScreen} />
            <Route path="/chat" component={ChatScreen} />

            <Route>
              <DashboardScreen />
            </Route>
          </Switch>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App
