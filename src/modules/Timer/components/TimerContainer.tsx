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
import { EditTimerDialog } from "./EditTimerDialog"
import { useState } from "react"
import { useElectronTray } from "@/modules/Timer/hooks/use-electron-tray.ts"


export function TimerContainer() {
    // Use Zustand store
    const timers = useTimers()

    // Electron tray integration
    const { notifyTimerStarted, notifyTimerPaused, notifyTimerStopped } = useElectronTray()

    // Estado local para los diálogos
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingTimerId, setEditingTimerId] = useState<string | null>(null)

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

    // Handle edit timer
    const handleEditTimer = (timerId: string) => {
        setEditingTimerId(timerId)
        setIsEditDialogOpen(true)
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
                <EditTimerDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    timerId={editingTimerId}
                />
            </>
        )
    }

    return (
        <>
            <div className="h-full flex flex-col">
                <TimerTabs
                    activeCount={activeTimers.length}
                    completedCount={completedTimers.length}
                    handleCreateTimer={handleCreateTimer}
                    className="flex-1"
                >
                    <TimerTabContent value="active" className="flex-1 h-full">
                        {activeTimers.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <TimerEmptyState
                                    variant="no-active"
                                    onCreateExample={handleCreateTimer}
                                />
                            </div>
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

                    <TimerTabContent value="completed" className="flex-1 h-full">
                        {completedTimers.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <TimerEmptyState variant="no-completed" />
                            </div>
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
            <EditTimerDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                timerId={editingTimerId}
            />
        </>
    )
}
