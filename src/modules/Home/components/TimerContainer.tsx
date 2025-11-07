import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    useTimers,
    useStartTimer,
    usePauseTimer,
    useStopTimer,
    useRemoveTimer
} from "@/stores/timer-store"
import { TimerStatus } from "@/types/timer"
import { TimerGrid } from "./TimerGrid"
import { TimerTabs, TimerTabContent } from "./TimerTabs"
import { TimerEmptyState } from "./TimerEmptyState"
import { CreateTimerDialog } from "./CreateTimerDialog"
import { useState } from "react"
import { useElectronTray } from "@/hooks/use-electron-tray"


export function TimerContainer() {
    // Use Zustand store
    const timers = useTimers()
    
    // Electron tray integration
    const { notifyTimerStarted, notifyTimerPaused, notifyTimerStopped } = useElectronTray()
    
    // Estado local para el diálogo
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    // Filtrar timers por estado
    const completedTimers = timers.filter(timer => timer.status === TimerStatus.COMPLETED)
    const activeTimers = timers.filter(timer => timer.status !== TimerStatus.COMPLETED)

    // Individual action hooks
    const startTimer = useStartTimer()
    const pauseTimer = usePauseTimer()
    const stopTimer = useStopTimer()
    const removeTimer = useRemoveTimer()

    // Enhanced timer actions with Electron notifications
    const handleStartTimer = (timerId: string) => {
        const timer = timers.find(t => t.id === timerId)
        if (timer) {
          startTimer(timerId)
          
          // Notify with current time as start time
          notifyTimerStarted({
            id: timer.id,
            title: timer.title,
            startTime: Date.now(),
            totalTime: timer.totalTime
          })
        }
    }

    const handlePauseTimer = (timerId: string) => {
        pauseTimer(timerId)
        notifyTimerPaused()
    }

    const handleStopTimer = (timerId: string) => {
        stopTimer(timerId)
        notifyTimerStopped()
    }

    // Handle edit timer - placeholder for future implementation
    const handleEditTimer = (timerId: string) => {
        console.log('Edit timer:', timerId)
        // Aquí implementarías la lógica para editar el timer
    }

    // Handle create timer
    const handleCreateTimer = () => {
        setIsCreateDialogOpen(true)
    }

    if (timers.length === 0) {
        return (
            <>
                <TimerEmptyState
                    variant="no-timers"
                    onCreateExample={handleCreateTimer}
                />
                <CreateTimerDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                />
            </>
        )
    }

    return (
        <>
            <div className="h-full">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex-1 text-center">
                        <h1 className="text-2xl font-semibold">Mis Timers</h1>
                    </div>
                    <Button 
                        onClick={handleCreateTimer} 
                        size="icon" 
                        variant="outline" 
                        className="!rounded-xl bg-card text-card-foreground border shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
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
                                onCreateExample={handleCreateTimer}
                            />
                        ) : (
                            <TimerGrid
                                timers={activeTimers}
                                onStartTimer={handleStartTimer}
                                onPauseTimer={handlePauseTimer}
                                onStopTimer={handleStopTimer}
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
                                onStartTimer={handleStartTimer}
                                onPauseTimer={handlePauseTimer}
                                onStopTimer={handleStopTimer}
                                onEditTimer={handleEditTimer}
                                onDeleteTimer={removeTimer}
                            />
                        )}
                    </TimerTabContent>
                </TimerTabs>
            </div>
            <CreateTimerDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
        </>
    )
}
