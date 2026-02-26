import { Card, CardContent } from '@/shared/components/ui/card'

export function RecentTasks() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-semibold text-foreground">Tareas Recientes</h2>
        <button className="text-sm text-primary hover:underline cursor-pointer">Ver todas</button>
      </div>

      <Card className="border-dashed border-2 bg-transparent border-border/40 min-h-[200px] flex items-center justify-center">
        <CardContent className="p-0 text-muted-foreground font-medium">
          No hay tareas registradas aún.
        </CardContent>
      </Card>
    </div>
  )
}
