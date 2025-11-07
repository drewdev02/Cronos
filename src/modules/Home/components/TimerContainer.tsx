import { Button } from "@/components/ui/button"
import {
    useTimers,
    useStartTimer,
    usePauseTimer,
    useStopTimer,
    useRemoveTimer,
    useCreateExampleTimer
} from "@/stores/timer-store"
import { TimerStatus } from "@/types/timer"
import { TimerGrid } from "./TimerGrid"
import { TimerTabs, TimerTabContent } from "./TimerTabs"
import { TimerEmptyState } from "./TimerEmptyState"


export function TimerContainer() {
    // Use Zustand store
    const timers = useTimers()
    console.debug({ timers });

    // Filtrar timers por estado
    const completedTimers = timers.filter(timer => timer.status === TimerStatus.COMPLETED)
    const activeTimers = timers.filter(timer => timer.status !== TimerStatus.COMPLETED)

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
            <TimerEmptyState
                variant="no-timers"
                onCreateExample={createExampleTimer}
            />
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

            <TimerTabs
                activeCount={activeTimers.length}
                completedCount={completedTimers.length}
            >
                <TimerTabContent value="active">
                    {activeTimers.length === 0 ? (
                        <TimerEmptyState
                            variant="no-active"
                            onCreateExample={createExampleTimer}
                        />
                    ) : (
                        <TimerGrid
                            timers={activeTimers}
                            onStartTimer={startTimer}
                            onPauseTimer={pauseTimer}
                            onStopTimer={stopTimer}
                            onEditTimer={handleEditTimer}
                            onDeleteTimer={removeTimer}
                        />
                    )}
                </TimerTabContent>

                <TimerTabContent value="completed">
                    {completedTimers.length === 0 ? (
                        <TimerEmptyState variant="no-completed" />
                    ) : (
                        <TimerGrid
                            timers={completedTimers}
                            onStartTimer={startTimer}
                            onPauseTimer={pauseTimer}
                            onStopTimer={stopTimer}
                            onEditTimer={handleEditTimer}
                            onDeleteTimer={removeTimer}
                        />
                    )}
                </TimerTabContent>
            </TimerTabs>
        </div>
    )
}
