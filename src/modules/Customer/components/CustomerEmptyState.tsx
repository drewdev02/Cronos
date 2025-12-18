import { Users, UserPlus } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

interface CustomerEmptyStateProps {
    variant: "no-customers" | "no-results"
    onCreateExample?: () => void
}

export function CustomerEmptyState({ variant, onCreateExample }: CustomerEmptyStateProps) {
    const getEmptyConfig = () => {
        switch (variant) {
            case "no-customers":
                return {
                    title: "No hay clientes",
                    description: "No tienes clientes registrados. Agrega tu primer cliente para comenzar.",
                    showButton: true,
                    buttonText: "Crear nuevo cliente"
                }
            case "no-results":
                return {
                    title: "No se encontraron clientes",
                    description: "No hay clientes que coincidan con tu búsqueda. Intenta con otros términos.",
                    showButton: false,
                    buttonText: ""
                }
            default:
                return {
                    title: "No hay clientes",
                    description: "No tienes clientes registrados.",
                    showButton: false,
                    buttonText: ""
                }
        }
    }

    const config = getEmptyConfig()

    return (
        <Empty className="from-muted/50 to-background h-full w-full bg-linear-to-b from-20%">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Users />
                </EmptyMedia>
                <EmptyTitle>{config.title}</EmptyTitle>
                <EmptyDescription>
                    {config.description}
                </EmptyDescription>
            </EmptyHeader>
            {config.showButton && onCreateExample && (
                <EmptyContent>
                    <Button onClick={onCreateExample} variant="outline" size="sm" className="cursor-pointer hover:bg-(--bg-secondary)">
                        <UserPlus className="h-4 w-4" />
                        {config.buttonText}
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    )
}