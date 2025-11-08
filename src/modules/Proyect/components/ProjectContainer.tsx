import {
    useProjectStore,
    useRemoveProject,
    useSelectProject
} from "@/stores/project-store"
import { useState } from "react"
import { Project } from "@/types/project"
import { ProjectHeader } from "./ProjectHeader"
import { ProjectEmptyState } from "./ProjectEmptyState"
import { CreateProjectDialog } from "./CreateProjectDialog"
import { EditProjectDialog } from "./EditProjectDialog"
import { ProjectGrid } from "./ProjectGrid"



export function ProjectContainer() {
    // Use single Zustand store selector
    const {
        projects,
        selectedProject,
        getFilteredProjects,
    } = useProjectStore()

    // Individual action hooks
    const removeProject = useRemoveProject()
    const selectProject = useSelectProject()

    // Estado local para los diálogos
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    // Get filtered projects - Zustand optimizes re-renders
    const filteredProjects = getFilteredProjects()

    // Handle edit project
    const handleEditProject = (project: Project) => {
        setEditingProject(project)
        setIsEditDialogOpen(true)
    }

    // Handle create project
    const handleCreateProject = () => {
        setIsCreateDialogOpen(true)
    }

    if (projects.length === 0) {
        return (
            <>
                <ProjectEmptyState
                    variant="no-projects"
                    onCreateExample={handleCreateProject}
                />
                <CreateProjectDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                />
                <EditProjectDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    project={editingProject}
                />
            </>
        )
    }

    return (
        <>
            <div className="h-full flex flex-col">
                {/* Header with search and filters */}
                <ProjectHeader onCreateProject={handleCreateProject} />

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    {filteredProjects.length === 0 ? (
                        <ProjectEmptyState
                            variant="no-results"
                            onCreateExample={handleCreateProject}
                        />
                    ) : (
                        <ProjectGrid
                            projects={filteredProjects}
                            onEditProject={handleEditProject}
                            onDeleteProject={removeProject}
                            onSelectProject={selectProject}
                            selectedProject={selectedProject}
                        />
                    )}
                </div>
            </div>

            <CreateProjectDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
            <EditProjectDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                project={editingProject}
            />
        </>
    )
}