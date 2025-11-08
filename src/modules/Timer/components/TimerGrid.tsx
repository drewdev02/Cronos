import { useTimers } from "@/stores/timer-store"
import { TimerCard } from "./TimerCard"
import { ScrollArea } from "@/components/ui/scroll-area"

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
        <ScrollArea className="h-full w-full max-h-full">
            <div className="p-6 pb-8">
                <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
            </div>
        </ScrollArea>
    )
}