import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useAddTimer } from "@/stores/timer-store"
import { Timer, TimerStatus } from "@/types/timer"
import { toast } from "sonner"

interface CreateTimerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTimerDialog({ open, onOpenChange }: CreateTimerDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [color, setColor] = useState("#007AFF")
  const [isLoading, setIsLoading] = useState(false)

  const addTimer = useAddTimer()

  // Colores predefinidos para seleccionar (macOS system colors)
  const predefinedColors = [
    "#007AFF", // blue
    "#34C759", // green
    "#FF9500", // orange
    "#FF3B30", // red
    "#AF52DE", // purple
    "#FF2D92", // pink
    "#5AC8FA", // cyan
    "#FFCC02", // yellow
  ]

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("El título es requerido")
      return
    }

    setIsLoading(true)

    try {
      const newTimer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        description: description.trim() || undefined,
        status: TimerStatus.IDLE,
        history: [],
        totalTime: 0,
        currentSessionStart: null,
        config: {
          tags: tags.length > 0 ? tags : undefined,
          color: color
        }
      }

      addTimer(newTimer)
      
      // Mostrar toast de éxito
      toast.success("Timer creado exitosamente", {
        description: `"${title}" ha sido agregado a tu lista`
      })

      // Limpiar formulario y cerrar diálogo
      setTitle("")
      setDescription("")
      setTags([])
      setNewTag("")
      setColor("#007AFF")
      onOpenChange(false)
      
    } catch (error) {
      toast.error("Error al crear el timer", {
        description: "Hubo un problema al guardar tu timer. Intenta de nuevo."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setTags([])
    setNewTag("")
    setColor("#007AFF")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#1e1e1e' }}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-medium">Crear nuevo timer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configura tu nuevo cronómetro con título, descripción y etiquetas
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Título *</Label>
            <Input
              id="title"
              placeholder="Ej: Sesión de trabajo, Estudio, Ejercicio..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe para qué usarás este timer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {predefinedColors.map((predefinedColor) => (
                <button
                  key={predefinedColor}
                  type="button"
                  className={`w-8 h-8 rounded-full border transition-all duration-200 ${
                    color === predefinedColor 
                      ? 'border-foreground/40 scale-110 ring-2 ring-foreground/20' 
                      : 'border-border/50 hover:scale-105 hover:border-border'
                  }`}
                  style={{ backgroundColor: predefinedColor }}
                  onClick={() => setColor(predefinedColor)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">Etiquetas</Label>
            <Input
              id="tags"
              placeholder="Presiona Enter para agregar etiquetas..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border/50">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-secondary border-border hover:bg-secondary/80"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !title.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {isLoading ? "Creando..." : "Crear timer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}