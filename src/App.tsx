import { Timer } from "./modules/Timer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useTimerTrayIntegration } from "@/modules/Timer/hooks/use-timer-tray-integration.ts";
import { Customer } from "./modules/Customer";
import ProjectModule from "./modules/Proyect";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";


enum AppRoute {
  Timer = "/timer",
  Customer = "/customer",
  Project = "/project",
  Statistics = "/statistics",
  StatisticsMonthly = "/statistics/monthly",
  StatisticsWeekly = "/statistics/weekly",
  StatisticsDaily = "/statistics/daily",
}

export type Route = {
  path: AppRoute;
  label: string;
  element: JSX.Element;
};


import StatisticsModule from "./modules/Statistics";
import MonthlyStatistics from "./modules/Statistics/components/MonthlyStatistics";
import WeeklyStatistics from "./modules/Statistics/components/WeeklyStatistics";
import DailyStatistics from "./modules/Statistics/components/DailyStatistics";

const routes: Route[] = [
  {
    path: AppRoute.Timer,
    label: "Timer",
    element: <Timer />,
  },
  {
    path: AppRoute.Customer,
    label: "Cliente",
    element: <Customer />,
  },
  {
    path: AppRoute.Project,
    label: "Proyecto",
    element: <ProjectModule />,
  },
  {
    path: AppRoute.Statistics,
    label: "Estadísticas",
    element: <StatisticsModule />,
  },
  {
    path: AppRoute.StatisticsMonthly,
    label: "Mensual",
    element: <MonthlyStatistics />,
  },
  {
    path: AppRoute.StatisticsWeekly,
    label: "Semanal",
    element: <WeeklyStatistics />,
  },
  {
    path: AppRoute.StatisticsDaily,
    label: "Diario",
    element: <DailyStatistics />,
  },
];

export default function App() {
  // Initialize tray integration
  useTimerTrayIntegration()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HashRouter>
        <SidebarProvider >
          <AppSidebar variant="inset" routes={routes} />
          <SidebarInset className="pl-4">
            <Routes>
              {routes.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Timer />} />
            </Routes>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
