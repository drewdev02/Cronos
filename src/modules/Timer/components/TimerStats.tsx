import { Timer } from "@/types/timer"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { CardContent } from "@/components/ui/card"
import { ClockIcon, CalendarIcon, DollarSignIcon, FolderIcon } from "lucide-react"
import { CopyIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ChevronDownIcon } from "lucide-react"
import { formatDate, formatDuration, getTotalTimeIncludingCurrent } from "@/modules/Timer/utils"
import { useProjectStore } from "@/stores/project-store"
import { useTimerEarnings, useCurrentSessionEarnings } from "@/stores/timer-store"

interface TimerStatsProps {
    timer: Timer
}

export function TimerStats({ timer }: TimerStatsProps) {
    const [copied, setCopied] = useState(false)
    const totalDisplayTime = getTotalTimeIncludingCurrent(timer)
    const hoursValue = (totalDisplayTime / 1000 / 3600)
    const getProjectById = useProjectStore(state => state.getProjectById)
    const totalEarnings = useTimerEarnings(timer.id)
    const currentSessionEarnings = useCurrentSessionEarnings(timer.id)

    const associatedProject = timer.projectId ? getProjectById(timer.projectId) : null

    return (
        <CardContent className="space-y-4 px-6! py-4! flex-1">
            {/* Proyecto asociado */}
            {associatedProject && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                    <FolderIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
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
                {/* Visualización en horas (sin barra de progreso) */}
                <div className="flex flex-col items-center gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">Horas totales</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{hoursValue.toFixed(3)}h</span>
                        <button
                            type="button"
                            className="p-1 rounded hover:bg-muted/60 transition"
                            aria-label="Copiar horas"
                            onClick={() => {
                                navigator.clipboard.writeText(hoursValue.toString())
                                setCopied(true)
                                toast.success('Copiado al portapapeles')
                                setTimeout(() => setCopied(false), 1200)
                            }}
                        >
                            <CopyIcon className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-muted-foreground'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Earnings si hay proyecto asociado - ahora expandible */}
            {associatedProject && totalEarnings > 0 && (
                <Collapsible defaultOpen className="w-full">
                    <CollapsibleTrigger asChild>
                        <div className="cursor-pointer text-center space-y-2 py-3 border rounded-lg bg-muted/40 border-border flex items-center justify-between px-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSignIcon className="w-4 h-4 text-green-500" />
                                <span>Ganancias totales</span>
                            </div>
                            <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="text-center space-y-2 py-3">
                            <div className="font-mono font-bold text-2xl text-green-500">
                                ${totalEarnings.toFixed(2)}
                            </div>
                            {currentSessionEarnings > 0 && (
                                <div className="text-xs text-green-400/80">
                                    Sesión actual: ${currentSessionEarnings.toFixed(2)}
                                </div>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
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
