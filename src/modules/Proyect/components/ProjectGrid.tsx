import { Project } from "@/types/project"
import { ProjectCard } from "./ProjectCard"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProjectGridProps {
    projects: Project[]
    onEditProject?: (project: Project) => void
    onDeleteProject?: (projectId: string) => void
    onSelectProject?: (project: Project) => void
    selectedProject?: Project | null
}

export function ProjectGrid({
    projects,
    onEditProject,
    onDeleteProject,
    onSelectProject,
    selectedProject,
}: ProjectGridProps) {
    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEditProject={onEditProject}
                            onDeleteProject={onDeleteProject}
                            onSelectProject={onSelectProject}
                            isSelected={selectedProject?.id === project.id}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}