import { IconBell } from "@tabler/icons-react"
import { RefreshCcwIcon } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

interface TimerEmptyStateProps {
  variant: "no-timers" | "no-active" | "no-completed"
  onCreateExample?: () => void
}

export function TimerEmptyState({ variant, onCreateExample }: TimerEmptyStateProps) {
  const getEmptyConfig = () => {
    switch (variant) {
      case "no-timers":
        return {
          title: "No hay timers",
          description: "No tienes timers creados. Crea tu primer timer para comenzar.",
          buttonText: "Crear tu primer timer",
          showButton: true,
        }
      case "no-active":
        return {
          title: "No hay timers activos",
          description: "No tienes timers activos. Crea tu primer timer para comenzar.",
          buttonText: "Crear tu primer timer",
          showButton: true,
        }
      case "no-completed":
        return {
          title: "No hay timers completados",
          description: "Los timers que completes aparecerán aquí.",
          showButton: false,
        }
      default:
        return {
          title: "No hay timers",
          description: "No tienes timers creados.",
          showButton: false,
        }
    }
  }

  const config = getEmptyConfig()

  return (
    <Empty className="from-muted/50 to-background bg-linear-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBell />
        </EmptyMedia>
        <EmptyTitle>{config.title}</EmptyTitle>
        <EmptyDescription>
          {config.description}
        </EmptyDescription>
      </EmptyHeader>
      {config.showButton && onCreateExample && (
        <EmptyContent>
          <Button onClick={onCreateExample} variant="outline" size="sm" className="cursor-pointer hover:bg-(--bg-secondary)">
            <RefreshCcwIcon />
            {config.buttonText}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}