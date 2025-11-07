import { Timer } from "@/types/timer"
import { Card } from "@/components/ui/card"
import { TimerHeader } from "./TimerHeader"
import { TimerStats } from "./TimerStats"
import { TimerControls } from "./TimerControls"

interface TimerCardProps {
    timer: Timer
    onStartTimer?: (timerId: string) => void
    onPauseTimer?: (timerId: string) => void
    onStopTimer?: (timerId: string) => void
    onEditTimer?: (timerId: string) => void
    onDeleteTimer?: (timerId: string) => void
}

export function TimerCard({
    timer,
    onStartTimer,
    onPauseTimer,
    onStopTimer,
    onEditTimer,
    onDeleteTimer
}: TimerCardProps) {
    return (
        <Card className="group hover:shadow-md transition-all duration-200 !flex !flex-col !gap-0 !py-0">
            <TimerHeader timer={timer} />
            <TimerStats timer={timer} />
            <TimerControls
                timer={timer}
                onStartTimer={onStartTimer}
                onPauseTimer={onPauseTimer}
                onStopTimer={onStopTimer}
                onEditTimer={onEditTimer}
                onDeleteTimer={onDeleteTimer}
            />
        </Card>
    )
}