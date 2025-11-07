import { Home } from "./modules/Home";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useTimerTrayIntegration } from "@/hooks/use-timer-tray-integration";

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