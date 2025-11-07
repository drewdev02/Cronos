import {useState, useEffect} from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Badge} from "@/components/ui/badge"
import {X} from "lucide-react"
import {useUpdateTimer, useTimerById} from "@/stores/timer-store"
import {Timer, TimerStatus} from "@/types/timer"
import {toast} from "sonner"

// Utility functions for time conversion
const millisecondsToTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return {hours, minutes, seconds}
}

const timeToMilliseconds = (hours: number, minutes: number, seconds: number) => {
    return (hours * 3600 + minutes * 60 + seconds) * 1000
}

interface EditTimerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    timerId: string | null
}

export function EditTimerDialog({open, onOpenChange, timerId}: EditTimerDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Time editing state
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const updateTimer = useUpdateTimer()
    const timer = useTimerById(timerId || "")

    // Load timer data when dialog opens
    useEffect(() => {
        if (open && timer) {
            setTitle(timer.title)
            setDescription(timer.description || "")
            setTags(timer.config?.tags || [])
            setNewTag("")

            // Load time values
            const timeValues = millisecondsToTime(timer.totalTime)
            setHours(timeValues.hours)
            setMinutes(timeValues.minutes)
            setSeconds(timeValues.seconds)
        }
    }, [open, timer])

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && newTag.trim() && !tags.includes(newTag.trim())) {
            e.preventDefault()
            setTags([...tags, newTag.trim()])
            setNewTag("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            const syntheticEvent = {
                preventDefault: () => {
                }
            } as React.FormEvent
            handleSubmit(syntheticEvent)
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const addQuickTime = (additionalMinutes: number) => {
        const totalMinutes = hours * 60 + minutes + additionalMinutes
        const newHours = Math.floor(totalMinutes / 60)
        const newMinutes = totalMinutes % 60

        setHours(Math.min(999, newHours))
        setMinutes(newMinutes)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Updating timer...");

        e.preventDefault()

        if (!title.trim()) {
            toast.error("El título es requerido")
            return
        }

        if (!timerId || !timer) {
            toast.error("Timer no encontrado")
            return
        }

        // Validate time values
        if (hours < 0 || minutes < 0 || seconds < 0) {
            toast.error("Los valores de tiempo deben ser positivos")
            return
        }

        if (hours > 999) {
            toast.error("El máximo de horas es 999")
            return
        }

        if (minutes > 59 || seconds > 59) {
            toast.error("Los minutos y segundos deben ser menores a 60")
            return
        }

        // Check if timer is running - warn user about time changes
        if (timer.status === TimerStatus.RUNNING) {
            const newTotalTime = timeToMilliseconds(hours, minutes, seconds)
            if (newTotalTime !== timer.totalTime) {
                toast.error("No se puede cambiar el tiempo de un timer en ejecución", {
                    description: "Pausa o detén el timer primero para modificar su tiempo"
                })
                return
            }
        }

        setIsLoading(true)

        try {
            const newTotalTime = timeToMilliseconds(hours, minutes, seconds)

            const updatedData: Partial<Timer> = {
                title: title.trim(),
                description: description.trim() || undefined,
                totalTime: newTotalTime,
                config: {
                    ...timer.config,
                    tags: tags.length > 0 ? tags : undefined
                }
            }

            updateTimer(timerId, updatedData)

            // Mostrar toast de éxito
            toast.success("Timer actualizado exitosamente", {
                description: `"${title}" ha sido modificado`
            })

            // Cerrar diálogo
            onOpenChange(false)

        } catch (error) {
            toast.error("Error al actualizar el timer", {
                description: "Hubo un problema al guardar los cambios. Intenta de nuevo."
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        // Restore original values
        if (timer) {
            setTitle(timer.title)
            setDescription(timer.description || "")
            setTags(timer.config?.tags || [])

            // Restore time values
            const timeValues = millisecondsToTime(timer.totalTime)
            setHours(timeValues.hours)
            setMinutes(timeValues.minutes)
            setSeconds(timeValues.seconds)
        }
        setNewTag("")
        onOpenChange(false)
    }

    // If no timer is selected, don't render the dialog
    if (!timer) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-w-xl" style={{backgroundColor: '#1e1e1e'}}>
                <DialogHeader className="space-y-4 pb-6">
                    <DialogTitle className="text-xl font-medium">Editar timer</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-sm font-medium">Título *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="dialog-input h-11"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    const syntheticEvent = {
                                        preventDefault: () => {
                                        }
                                    } as React.FormEvent
                                    handleSubmit(syntheticEvent)
                                }
                            }}
                            className="dialog-input resize-none min-h-[90px]"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="tags" className="text-sm font-medium">Etiquetas</Label>
                        <Input
                            id="tags"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="dialog-input h-11"
                            placeholder="Presiona Enter para agregar una etiqueta"
                        />
                        {tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-4">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary"
                                           className="gap-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border/50">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Tiempo total</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="hours" className="text-xs text-muted-foreground">Horas</Label>
                                <Input
                                    id="hours"
                                    type="number"
                                    min="0"
                                    max="999"
                                    value={hours}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0
                                        setHours(Math.max(0, Math.min(999, value)))
                                    }}
                                    className="dialog-input h-11 text-center"
                                    placeholder="0"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minutes" className="text-xs text-muted-foreground">Minutos</Label>
                                <Input
                                    id="minutes"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minutes}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0
                                        setMinutes(Math.max(0, Math.min(59, value)))
                                    }}
                                    className="dialog-input h-11 text-center"
                                    placeholder="0"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seconds" className="text-xs text-muted-foreground">Segundos</Label>
                                <Input
                                    id="seconds"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={seconds}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0
                                        setSeconds(Math.max(0, Math.min(59, value)))
                                    }}
                                    className="dialog-input h-11 text-center"
                                    placeholder="0"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                />
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Tiempo
                            total: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>

                        {/* Quick time buttons */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Agregar tiempo rápido:</Label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addQuickTime(15)}
                                    className="text-xs h-8 px-3"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                >
                                    +15min
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addQuickTime(30)}
                                    className="text-xs h-8 px-3"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                >
                                    +30min
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addQuickTime(60)}
                                    className="text-xs h-8 px-3"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                >
                                    +1h
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setHours(0)
                                        setMinutes(0)
                                        setSeconds(0)
                                    }}
                                    className="text-xs h-8 px-3 text-destructive hover:text-destructive"
                                    disabled={timer?.status === TimerStatus.RUNNING}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {timer?.status === TimerStatus.RUNNING && (
                            <div
                                className="text-xs text-amber-500 mt-2 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border">
                                ⚠️ Este timer está en ejecución. No podrás cambiar el tiempo hasta que lo pauses o
                                detengas.
                            </div>
                        )}
                    </div>
                </form>

                <DialogFooter className="gap-4 pt-8 !justify-center sm:!justify-center">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="h-11 px-8"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-11 px-8"
                    >
                        {isLoading ? "Actualizando..." : "Guardar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
