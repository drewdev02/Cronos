import { FolderOpen, FolderPlus } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

interface ProjectEmptyStateProps {
    variant: "no-projects" | "no-results"
    onCreateExample?: () => void
}

export function ProjectEmptyState({ variant, onCreateExample }: ProjectEmptyStateProps) {
    const getEmptyConfig = () => {
        switch (variant) {
            case "no-projects":
                return {
                    title: "No hay proyectos",
                    description: "No tienes proyectos registrados. Crea tu primer proyecto para comenzar a gestionar el tiempo.",
                    showButton: true,
                    buttonText: "Crear nuevo proyecto"
                }
            case "no-results":
                return {
                    title: "No se encontraron proyectos",
                    description: "No hay proyectos que coincidan con tu búsqueda. Intenta con otros términos o filtros.",
                    showButton: false,
                    buttonText: ""
                }
            default:
                return {
                    title: "No hay proyectos",
                    description: "No tienes proyectos registrados.",
                    showButton: false,
                    buttonText: ""
                }
        }
    }

    const config = getEmptyConfig()

    return (
        <Empty className="from-muted/50 to-background h-full w-full bg-linear-to-b from-30%">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderOpen />
                </EmptyMedia>
                <EmptyTitle>{config.title}</EmptyTitle>
                <EmptyDescription>
                    {config.description}
                </EmptyDescription>
            </EmptyHeader>
            {config.showButton && onCreateExample && (
                <EmptyContent>
                    <Button onClick={onCreateExample} variant="outline" size="sm" className="cursor-pointer">
                        <FolderPlus className="h-4 w-4" />
                        {config.buttonText}
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    )
}