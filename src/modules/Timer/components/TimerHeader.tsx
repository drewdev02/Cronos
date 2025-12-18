import { Timer } from "@/types/timer"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TagIcon } from "lucide-react"
import { getStatusLabel, getStatusVariant } from "@/modules/Timer/utils"


interface TimerHeaderProps {
    timer: Timer
}

export function TimerHeader({ timer }: TimerHeaderProps) {
    return (
        <CardHeader className="space-y-3 !px-6 !py-4 !grid-rows-none !grid-cols-none !grid !gap-3">
            <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-1" title={timer.title}>
                        {timer.title}
                    </CardTitle>
                    {timer.description && (
                        <CardDescription className="line-clamp-2" title={timer.description}>
                            {timer.description}
                        </CardDescription>
                    )}
                </div>
                <Badge variant={getStatusVariant(timer.status)} className="ml-3 shrink-0">
                    {getStatusLabel(timer.status)}
                </Badge>
            </div>

            {timer.config?.tags && timer.config.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <TagIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex gap-1 flex-wrap">
                        {timer.config.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {timer.config.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{timer.config.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            )}
        </CardHeader>
    )
}
