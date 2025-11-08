import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, DollarSign, Clock, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProjectStats } from "@/types/project"

interface ProjectHeaderProps {
    onCreateProject: () => void
}

export function ProjectHeader({ onCreateProject }: ProjectHeaderProps) {
    // This would normally come from the store via a hook
    // For now, we'll use mock data
    const stats: ProjectStats = {
        totalProjects: 0,
        projectsByStatus: {
            planning: 0,
            active: 0,
            on_hold: 0,
            completed: 0,
            cancelled: 0
        },
        totalTimeSpent: 0,
        totalBilled: 0,
        averageHourlyRate: 0,
        totalActiveProjects: 0,
        totalCompletedProjects: 0,
        topCustomers: [],
        revenueByMonth: [],
        projectsWithOvertime: 0,
        averageProjectDuration: 0
    }

    return (
        <div className="p-6 border-b bg-background">
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-semibold">Mis Proyectos</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona tus proyectos y cronómetros
                    </p>
                </div>
                <Button
                    onClick={onCreateProject}
                    size="icon"
                    variant="outline"
                    className="!rounded-xl bg-card text-card-foreground border shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{stats.totalProjects}</p>
                        <p className="text-xs text-muted-foreground">Proyectos</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{stats.totalActiveProjects}</p>
                        <p className="text-xs text-muted-foreground">Activos</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30">
                        <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">${stats.averageHourlyRate.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Rate Promedio</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{Math.floor(stats.totalTimeSpent / (1000 * 60 * 60))}h</p>
                        <p className="text-xs text-muted-foreground">Tiempo Total</p>
                    </div>
                </div>
            </div>

            {/* Status distribution */}
            {stats.totalProjects > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Estado de proyectos</p>
                    <div className="flex gap-1 flex-wrap">
                        {Object.entries(stats.projectsByStatus).map(([status, count]) => {
                            if (count === 0) return null
                            const statusColors = {
                                planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                                on_hold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                                completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                                cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }
                            return (
                                <Badge 
                                    key={status} 
                                    variant="outline" 
                                    className={`text-xs ${statusColors[status as keyof typeof statusColors]}`}
                                >
                                    {status} ({count})
                                </Badge>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}