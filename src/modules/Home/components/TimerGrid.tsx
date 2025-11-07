import { useTimers } from "@/stores/timer-store"
import { TimerCard } from "./TimerCard"

interface TimerGridProps {
    timers: ReturnType<typeof useTimers>
    onStartTimer?: (timerId: string) => void
    onPauseTimer?: (timerId: string) => void
    onStopTimer?: (timerId: string) => void
    onEditTimer?: (timerId: string) => void
    onDeleteTimer?: (timerId: string) => void
}

export function TimerGrid({
    timers,
    onStartTimer,
    onPauseTimer,
    onStopTimer,
    onEditTimer,
    onDeleteTimer
}: TimerGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {timers.map((timer) => (
                <TimerCard
                    key={timer.id}
                    timer={timer}
                    onStartTimer={onStartTimer}
                    onPauseTimer={onPauseTimer}
                    onStopTimer={onStopTimer}
                    onEditTimer={onEditTimer}
                    onDeleteTimer={onDeleteTimer}
                />
            ))}
        </div>
    )
}