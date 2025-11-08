import { Customer } from "@/types/customer"
import { CustomerCard } from "./CustomerCard"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CustomerGridProps {
    customers: Customer[]
    onEditCustomer?: (customer: Customer) => void
    onDeleteCustomer?: (customerId: string) => void
    onSelectCustomer?: (customer: Customer) => void
    selectedCustomer?: Customer | null
}

export function CustomerGrid({
    customers,
    onEditCustomer,
    onDeleteCustomer,
    onSelectCustomer,
    selectedCustomer,
}: CustomerGridProps) {
    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                    {customers.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onEditCustomer={onEditCustomer}
                            onDeleteCustomer={onDeleteCustomer}
                            onSelectCustomer={onSelectCustomer}
                            isSelected={selectedCustomer?.id === customer.id}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}