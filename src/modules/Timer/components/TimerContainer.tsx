import {
    useTimers,
    useStartTimer,
    usePauseTimer,
    useStopTimer,
    useRemoveTimer
} from "@/stores/timer-store"
import { useProjects } from "@/stores/project-store"
import { useElectronTray } from "@/modules/Timer/hooks/use-electron-tray"
import { TimerStatus } from "@/types/timer"
import { TimerGrid } from "./TimerGrid"
import { TimerTabs, TimerTabContent } from "./TimerTabs"
import { TimerEmptyState } from "./TimerEmptyState"
import { CreateTimerDialog } from "./CreateTimerDialog"
import { EditTimerDialog } from "./EditTimerDialog"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TimerContainer() {
    const timers = useTimers()
    const projects = useProjects()
    const [selectedProjectId, setSelectedProjectId] = useState<string | "all">("all")

    const { notifyTimerStarted, notifyTimerPaused, notifyTimerStopped } = useElectronTray()

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingTimerId, setEditingTimerId] = useState<string | null>(null)

    const getLastSessionDate = (timer: { history: { endTime: Date | null }[]; createdAt: Date }) => {
        if (timer.history.length > 0) {
            const lastEntry = [...timer.history].reverse().find(entry => entry.endTime)
            if (lastEntry && lastEntry.endTime) return new Date(lastEntry.endTime).getTime();
        }
        return new Date(timer.createdAt).getTime();
    };
    const sortByLastSessionDesc = (a: { history: { endTime: Date | null }[]; createdAt: Date }, b: { history: { endTime: Date | null }[]; createdAt: Date }) => getLastSessionDate(b) - getLastSessionDate(a);
    const filteredTimers = selectedProjectId === "all"
        ? timers
        : timers.filter(timer => timer.projectId === selectedProjectId)
    const completedTimers = filteredTimers.filter(timer => timer.status === TimerStatus.COMPLETED).sort(sortByLastSessionDesc);
    const activeTimers = filteredTimers.filter(timer => timer.status !== TimerStatus.COMPLETED).sort(sortByLastSessionDesc);

    const startTimer = useStartTimer()
    const pauseTimer = usePauseTimer()
    const stopTimer = useStopTimer()
    const removeTimer = useRemoveTimer()

    const handleStartTimer = (timerId: string) => {
        const timer = timers.find(t => t.id === timerId)
        if (timer) {
            startTimer(timerId)
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

    const handleEditTimer = (timerId: string) => {
        setEditingTimerId(timerId)
        setIsEditDialogOpen(true)
    }

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
            <div className="h-full w-full flex flex-col">
                {/* Filtro por proyecto */}
                <div className="flex items-center gap-2 px-6 pt-4 pb-2">
                    <label htmlFor="project-filter" className="text-sm font-medium text-muted-foreground">Filtrar por proyecto:</label>
                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                        <SelectTrigger className="bg-card w-40 h-9">
                            <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent className="bg-card **:[[role=option]]:cursor-pointer">
                            <SelectItem value="all">Todos</SelectItem>
                            {projects.map((project: { id: string; name: string }) => (
                                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
