import { Home } from "./modules/Home";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Home />
      <Toaster />
    </ThemeProvider>
  )
}