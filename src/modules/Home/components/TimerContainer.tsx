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
import {
    useTimers,
    useStartTimer,
    usePauseTimer,
    useStopTimer,
    useRemoveTimer,
    useCreateExampleTimer
} from "@/stores/timer-store"
import { TimerGrid } from "./TimerGrid"


export function TimerContainer() {
    // Use Zustand store
    const timers = useTimers()
    console.debug({ timers });


    // Individual action hooks
    const startTimer = useStartTimer()
    const pauseTimer = usePauseTimer()
    const stopTimer = useStopTimer()
    const removeTimer = useRemoveTimer()
    const createExampleTimer = useCreateExampleTimer()

    // Handle edit timer - placeholder for future implementation
    const handleEditTimer = (timerId: string) => {
        console.log('Edit timer:', timerId)
        // Aquí implementarías la lógica para editar el timer
    }

    if (timers.length === 0) {
        return (
            <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <IconBell />
                    </EmptyMedia>
                    <EmptyTitle>No hay timers</EmptyTitle>
                    <EmptyDescription>
                        No tienes timers creados. Crea tu primer timer para comenzar.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={createExampleTimer} variant="outline" size="sm">
                        <RefreshCcwIcon />
                        Crear timer de ejemplo
                    </Button>
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <div className="h-full">
            <div className="flex items-center justify-between p-6 border-b">
                <div>
                    <h1 className="text-2xl font-semibold">Mis Timers</h1>
                    <p className="text-muted-foreground">
                        Gestiona tus cronómetros y sesiones de trabajo
                    </p>
                </div>
                <Button onClick={createExampleTimer}>
                    Agregar timer
                </Button>
            </div>

            <TimerGrid
                timers={timers}
                onStartTimer={startTimer}
                onPauseTimer={pauseTimer}
                onStopTimer={stopTimer}
                onEditTimer={handleEditTimer}
                onDeleteTimer={removeTimer}
            />
        </div>
    )
}
