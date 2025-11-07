import { Timer, TimerStatus } from "@/types/timer"
import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    PlayIcon,
    PauseIcon,
    SquareIcon
} from "lucide-react"

interface TimerControlsProps {
    timer: Timer
    onStartTimer?: (timerId: string) => void
    onPauseTimer?: (timerId: string) => void
    onStopTimer?: (timerId: string) => void
    onEditTimer?: (timerId: string) => void
    onDeleteTimer?: (timerId: string) => void
}

export function TimerControls({
    timer,
    onStartTimer,
    onPauseTimer,
    onStopTimer,
    onEditTimer,
    onDeleteTimer
}: TimerControlsProps) {
    return (
        <CardFooter className="flex flex-col gap-3 !px-6 !py-4 mt-auto">
            {/* Controles principales */}
            <div className="flex justify-center gap-2 w-full">
                {timer.status === TimerStatus.IDLE || timer.status === TimerStatus.PAUSED ? (
                    <Button
                        size="sm"
                        className="flex items-center gap-2 flex-1"
                        onClick={() => onStartTimer?.(timer.id)}
                    >
                        <PlayIcon className="w-4 h-4" />
                        {timer.status === TimerStatus.PAUSED ? 'Reanudar' : 'Iniciar'}
                    </Button>
                ) : timer.status === TimerStatus.RUNNING ? (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex items-center gap-2 flex-1"
                        onClick={() => onPauseTimer?.(timer.id)}
                    >
                        <PauseIcon className="w-4 h-4" />
                        Pausar
                    </Button>
                ) : null}

                {timer.status !== TimerStatus.IDLE && timer.status !== TimerStatus.COMPLETED && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => onStopTimer?.(timer.id)}
                    >
                        <SquareIcon className="w-4 h-4" />
                        Detener
                    </Button>
                )}
            </div>

            {/* Controles secundarios */}
            <div className="flex justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditTimer?.(timer.id)}
                    className="text-xs"
                >
                    Editar
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteTimer?.(timer.id)}
                    className="text-xs text-destructive hover:text-destructive"
                >
                    Eliminar
                </Button>
            </div>
        </CardFooter>
    )
}