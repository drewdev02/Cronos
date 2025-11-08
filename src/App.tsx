import { Timer } from "./modules/Timer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useTimerTrayIntegration } from "@/modules/Timer/hooks/use-timer-tray-integration.ts";
import { Customer } from "./modules/Customer";
import { HashRouter, Routes, Route } from "react-router-dom";


enum AppRoute {
  Timer = "/timer",
  Customer = "/customer",
}

type Route = {
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
        {/* Navegación eliminada por solicitud */}
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Timer />} />
        </Routes>
        <Toaster />
      </HashRouter>
    </ThemeProvider>
  )
}
