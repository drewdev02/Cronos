import { Project, ProjectStatus } from "@/types/project"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    FolderOpen,
    DollarSign,
    Clock,
    Timer,
    Edit,
    Trash2,
    User,
    Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/stores/customer-store"

interface ProjectCardProps {
    project: Project
    onEditProject?: (project: Project) => void
    onDeleteProject?: (projectId: string) => void
    onSelectProject?: (project: Project) => void
    isSelected?: boolean
}

export function ProjectCard({
    project,
    onEditProject,
    onDeleteProject,
    onSelectProject,
    isSelected = false
}: ProjectCardProps) {
    const customers = useCustomers()
    const customer = customers.find(c => c.id === project.customerId)

    const getProjectInitials = (name: string) => {
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
    }

    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.PLANNING:
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            case ProjectStatus.ACTIVE:
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            case ProjectStatus.ON_HOLD:
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            case ProjectStatus.COMPLETED:
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            case ProjectStatus.CANCELLED:
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
        }
    }

    const getStatusLabel = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.PLANNING:
                return "Planificando"
            case ProjectStatus.ACTIVE:
                return "Activo"
            case ProjectStatus.ON_HOLD:
                return "En Pausa"
            case ProjectStatus.COMPLETED:
                return "Completado"
            case ProjectStatus.CANCELLED:
                return "Cancelado"
            default:
                return status
        }
    }

    const handleCardClick = () => {
        onSelectProject?.(project)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date)
    }

    return (
        <Card
            className={cn(
                "group hover:shadow-md transition-all duration-200 cursor-pointer",
                isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={handleCardClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getProjectInitials(project.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base line-clamp-1" title={project.name}>
                                {project.name}
                            </CardTitle>
                            {customer && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span className="line-clamp-1" title={customer.companyName}>
                                        {customer.companyName}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEditProject?.(project)
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                
                                if (window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`)) {
                                    onDeleteProject?.(project.id)
                                }
                            }}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Status and Rate */}
                <div className="flex items-center justify-between">
                    <Badge className={cn("text-xs", getStatusColor(project.status))}>
                        {getStatusLabel(project.status)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-3 w-3" />
                        <span>{project.hourlyRate} {project.currency}/h</span>
                    </div>
                </div>

                {/* Description */}
                {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2" title={project.description}>
                        {project.description}
                    </p>
                )}

                {/* Timers */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-3 w-3 flex-shrink-0" />
                    <span>
                        {project.timerIds.length} cronómetro{project.timerIds.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Dates */}
                <div className="space-y-1">
                    {project.startDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>Inicio: {formatDate(project.startDate)}</span>
                        </div>
                    )}
                    {project.endDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>Fin: {formatDate(project.endDate)}</span>
                        </div>
                    )}
                </div>

                {/* Time Stats */}
                <div className="flex items-center justify-between pt-2 border-t">
                    {project.estimatedHours && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{project.estimatedHours}h estimadas</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FolderOpen className="h-3 w-3" />
                        <span>Creado {formatDate(project.createdAt)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}