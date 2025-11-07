import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TimerTabsProps {
    defaultValue?: string
    activeCount: number
    completedCount: number
    className?: string
    children: React.ReactNode
}

export function TimerTabs({
    defaultValue = "active",
    activeCount,
    completedCount,
    className,
    children
}: TimerTabsProps) {
    return (
        <Tabs defaultValue={defaultValue} className={cn("h-full flex flex-col", className)}>
            <div className="flex justify-center px-6 pt-6 pb-4 border-b bg-background/50">
                <TabsList className="grid grid-cols-2 w-fit min-w-[320px] bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger
                        value="active"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-200 
                     data-[state=active]:bg-background data-[state=active]:shadow-md 
                     data-[state=active]:text-foreground data-[state=active]:border 
                     data-[state=inactive]:text-muted-foreground hover:text-foreground"
                    >
                        <span className="font-medium">Activos</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors
                         data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                         data-[state=inactive]:bg-muted-foreground/20 data-[state=inactive]:text-muted-foreground">
                            {activeCount}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-200
                     data-[state=active]:bg-background data-[state=active]:shadow-md 
                     data-[state=active]:text-foreground data-[state=active]:border
                     data-[state=inactive]:text-muted-foreground hover:text-foreground"
                    >
                        <span className="font-medium">Completados</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors
                         data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                         data-[state=inactive]:bg-muted-foreground/20 data-[state=inactive]:text-muted-foreground">
                            {completedCount}
                        </span>
                    </TabsTrigger>
                </TabsList>
            </div>
            {children}
        </Tabs>
    )
}

// Componente para el contenido de cada tab
interface TimerTabContentProps {
    value: string
    children: React.ReactNode
    className?: string
}

export function TimerTabContent({ value, children, className }: TimerTabContentProps) {
    return (
        <TabsContent value={value} className={cn("flex-1 mt-0 px-0", className)}>
            {children}
        </TabsContent>
    )
}