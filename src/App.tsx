import { Home } from "./modules/Timer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useTimerTrayIntegration } from "@/modules/Timer/hooks/use-timer-tray-integration.ts";

export default function App() {
  // Initialize tray integration
  useTimerTrayIntegration()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Home />
      <Toaster />
    </ThemeProvider>
  )
}
