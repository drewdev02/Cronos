import { Timer } from "@/types/timer"
import { CardContent } from "@/components/ui/card"
import { ClockIcon, CalendarIcon } from "lucide-react"
import { formatDate, formatDuration, getTotalTimeIncludingCurrent } from "@/modules/Timer/utils"

interface TimerStatsProps {
    timer: Timer
}

export function TimerStats({ timer }: TimerStatsProps) {
    const totalDisplayTime = getTotalTimeIncludingCurrent(timer)
    return (
        <CardContent className="space-y-4 !px-6 !py-4 flex-1">
            {/* Tiempo total destacado */}
            <div className="text-center space-y-2 py-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    <span>Tiempo total</span>
                </div>
                <div className="font-mono font-bold text-3xl text-foreground">
                    {formatDuration(totalDisplayTime)}
                </div>
            </div>

            {/* Estadísticas en grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="text-center space-y-1">
                    <div className="text-2xl font-semibold text-foreground">
                        {timer.history.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Sesiones</div>
                </div>
                <div className="text-center space-y-1">
                    <div className="text-2xl font-semibold text-foreground">
                        {timer.history.length > 0
                            ? formatDuration(timer.totalTime / timer.history.length)
                            : '0s'
                        }
                    </div>
                    <div className="text-xs text-muted-foreground">Promedio</div>
                </div>
            </div>

            {/* Información de fecha */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <CalendarIcon className="w-3 h-3" />
                <span>Creado: {formatDate(timer.createdAt)}</span>
            </div>
        </CardContent>
    )
}
