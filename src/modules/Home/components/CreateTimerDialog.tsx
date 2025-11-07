import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [isLoading, setIsLoading] = useState(false)

  const addTimer = useAddTimer()

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
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
      handleSubmit(syntheticEvent)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting form...");
    
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
          tags: tags.length > 0 ? tags : undefined
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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-w-xl" style={{ backgroundColor: '#1e1e1e' }}>
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-xl font-medium">Crear nuevo timer</DialogTitle>
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
                  const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
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
            />
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-11 px-8"
          >
            {isLoading ? "Creando..." : "Crear timer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}