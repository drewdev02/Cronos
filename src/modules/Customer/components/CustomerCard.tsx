import { Customer } from "@/types/customer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Building,
    Mail,
    Phone,
    MapPin,
    Globe,
    CreditCard,
    Edit,
    Trash2,
    User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomerCardProps {
    customer: Customer
    onEditCustomer?: (customer: Customer) => void
    onDeleteCustomer?: (customerId: string) => void
    onSelectCustomer?: (customer: Customer) => void
    isSelected?: boolean
}

export function CustomerCard({
    customer,
    onEditCustomer,
    onDeleteCustomer,
    onSelectCustomer,
    isSelected = false
}: CustomerCardProps) {

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const handleCardClick = () => {
        onSelectCustomer?.(customer)
    }

    return (
        <Card
            className={cn(
                "group hover:shadow-md transition-all duration-200 cursor-pointer",
                isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={handleCardClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getInitials(customer.firstName, customer.lastName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base line-clamp-1" title={customer.companyName}>
                                {customer.companyName}
                            </CardTitle>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span className="line-clamp-1">
                                    {customer.firstName} {customer.lastName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEditCustomer?.(customer)
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                
                                // Agregar confirmación
                                if (window.confirm(`¿Estás seguro de que quieres eliminar a ${customer.companyName}?`)) {
                                    onDeleteCustomer?.(customer.id)
                                }
                            }}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Contact Info */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1" title={customer.email}>
                            {customer.email}
                        </span>
                    </div>

                    {customer.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{customer.phoneNumber}</span>
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="line-clamp-1" title={`${customer.city}, ${customer.country}`}>
                        {customer.city}, {customer.country}
                    </span>
                </div>

                {/* Website */}
                {customer.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-3 w-3 flex-shrink-0" />
                        <a
                            href={customer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="line-clamp-1 hover:text-primary underline"
                            onClick={(e) => e.stopPropagation()}
                            title={customer.website}
                        >
                            {customer.website.replace(/^https?:\/\//, '')}
                        </a>
                    </div>
                )}

                {/* Currency */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                            {customer.invoiceCurrency}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                            {customer.country}
                        </Badge>
                    </div>
                </div>

                {/* Additional Info */}
                {customer.additionalInfo && (
                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground line-clamp-2" title={customer.additionalInfo}>
                            {customer.additionalInfo}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}