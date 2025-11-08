import { Timer } from "@/types/timer"
import { CardContent } from "@/components/ui/card"
import { ClockIcon, CalendarIcon, DollarSignIcon, FolderIcon } from "lucide-react"
import { formatDate, formatDuration, getTotalTimeIncludingCurrent } from "@/modules/Timer/utils"
import { useProjectStore } from "@/stores/project-store"
import { useTimerEarnings, useCurrentSessionEarnings } from "@/stores/timer-store"

interface TimerStatsProps {
    timer: Timer
}

export function TimerStats({ timer }: TimerStatsProps) {
    const totalDisplayTime = getTotalTimeIncludingCurrent(timer)
    const getProjectById = useProjectStore(state => state.getProjectById)
    const totalEarnings = useTimerEarnings(timer.id)
    const currentSessionEarnings = useCurrentSessionEarnings(timer.id)
    
    const associatedProject = timer.projectId ? getProjectById(timer.projectId) : null

    return (
        <CardContent className="space-y-4 !px-6 !py-4 flex-1">
            {/* Proyecto asociado */}
            {associatedProject && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <FolderIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                        {associatedProject.name}
                    </span>
                </div>
            )}

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

            {/* Earnings si hay proyecto asociado */}
            {associatedProject && totalEarnings > 0 && (
                <div className="text-center space-y-2 py-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                        <DollarSignIcon className="w-4 h-4" />
                        <span>Ganancias totales</span>
                    </div>
                    <div className="font-mono font-bold text-2xl text-green-800">
                        ${totalEarnings.toFixed(2)}
                    </div>
                    {currentSessionEarnings > 0 && (
                        <div className="text-xs text-green-600">
                            Sesión actual: ${currentSessionEarnings.toFixed(2)}
                        </div>
                    )}
                </div>
            )}

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
