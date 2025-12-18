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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, FolderIcon } from "lucide-react"
import { useAddTimer } from "@/stores/timer-store"
import { useProjects } from "@/stores/project-store"
import { Timer, TimerStatus } from "@/types/timer"
import { toast } from "sonner"

interface CreateTimerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTimerDialog({ open, onOpenChange }: CreateTimerDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addTimer = useAddTimer()
  const projects = useProjects()

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
        projectId: projectId || undefined,
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
      setProjectId(undefined)
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
    setProjectId(undefined)
    setTags([])
    setNewTag("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-w-xl">
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
              className="resize-none min-h-40"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="project" className="text-sm font-medium">Proyecto</Label>
            <Select value={projectId || "no-project"} onValueChange={(value) => setProjectId(value === "no-project" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proyecto (opcional)">
                  {projectId && projects.find(p => p.id === projectId) ? (
                    <div className="flex items-center gap-2">
                      <FolderIcon className="w-4 h-4" />
                      <span>{projects.find(p => p.id === projectId)?.name}</span>
                    </div>
                  ) : (
                    <span>Sin proyecto</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="no-project" className="cursor-pointer">Sin proyecto</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FolderIcon className="w-4 h-4" />
                      <span>{project.name}</span>
                      <span className="text-muted-foreground text-sm">
                        (${project.hourlyRate}/h)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tags" className="text-sm font-medium">Etiquetas</Label>
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
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

        <DialogFooter className="flex flex-row gap-4 pt-6 justify-center!">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-11 px-8 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="h-11 px-8 cursor-pointer"
          >
            {isLoading ? "Creando..." : "Crear timer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}