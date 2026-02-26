import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconColor?: string
}

export function StatCard({ title, value, icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          </div>
          <Icon className={`w-5 h-5 ${iconColor || 'text-primary'}`} />
        </div>
      </CardContent>
    </Card>
  )
}
