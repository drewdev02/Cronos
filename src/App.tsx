import { Timer } from "./modules/Timer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useTimerTrayIntegration } from "@/modules/Timer/hooks/use-timer-tray-integration.ts";
import { Customer } from "./modules/Customer";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";


enum AppRoute {
  Timer = "/timer",
  Customer = "/customer",
}

export type Route = {
  path: AppRoute;
  label: string;
  element: JSX.Element;
};

const routes: Route[] = [
  {
    path: AppRoute.Timer,
    label: "Timer",
    element: <Timer />,
  },
  {
    path: AppRoute.Customer,
    label: "Customer",
    element: <Customer />,
  },
];

export default function App() {
  // Initialize tray integration
  useTimerTrayIntegration()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HashRouter>
        <SidebarProvider>
          <AppSidebar routes={routes} />
          <div className="ml-[16rem]">
            <Routes>
              {routes.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Timer />} />
            </Routes>
            <Toaster />
          </div>
        </SidebarProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
