import { Button } from "@/components/ui/button"
import { Plus, Users, Globe, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CustomerStats {
    totalCustomers: number
    uniqueCountries: number
    uniqueCurrencies: number
    customersWithWebsite: number
    topCountries: Array<{ country: string; count: number }>
    topCurrencies: Array<{ currency: string; count: number }>
}

interface CustomerHeaderProps {
    stats: CustomerStats
    onCreateCustomer: () => void
}

export function CustomerHeader({ stats, onCreateCustomer }: CustomerHeaderProps) {
    return (
        <div className="p-6 border-b bg-background">
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-semibold">Mis Clientes</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestiona tu cartera de clientes
                    </p>
                </div>
                <Button
                    onClick={onCreateCustomer}
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
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{stats.totalCustomers}</p>
                        <p className="text-xs text-muted-foreground">Clientes</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{stats.uniqueCountries}</p>
                        <p className="text-xs text-muted-foreground">Países</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30">
                        <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{stats.uniqueCurrencies}</p>
                        <p className="text-xs text-muted-foreground">Monedas</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30">
                        <Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{stats.customersWithWebsite}</p>
                        <p className="text-xs text-muted-foreground">Con Web</p>
                    </div>
                </div>
            </div>

            {/* Top stats */}
            {(stats.topCountries.length > 0 || stats.topCurrencies.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {stats.topCountries.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Países principales</p>
                            <div className="flex gap-1 flex-wrap">
                                {stats.topCountries.slice(0, 3).map((item, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {item.country} ({item.count})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {stats.topCurrencies.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Monedas principales</p>
                            <div className="flex gap-1 flex-wrap">
                                {stats.topCurrencies.slice(0, 3).map((item, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {item.currency} ({item.count})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}