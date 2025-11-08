import { Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    useCustomerStore,
    useRemoveCustomer,
    useSelectCustomer
} from "@/stores/customer-store"
import { useState, useMemo } from "react"
import { Customer } from "@/types/customer"
import { CustomerEmptyState } from "./CustomerEmptyState"
import { CreateCustomerDialog } from "./CreateCustomerDialog"
import { EditCustomerDialog } from "./EditCustomerDialog"
import { CustomerHeader } from "./CustomerHeader"
import { CustomerGrid } from "./CustomerGrid"


export function CustomerContainer() {
    // Use single Zustand store selector
    const {
        customers,
        searchQuery,
        setSearchQuery,
        selectedCustomer,
        getFilteredCustomers,
    } = useCustomerStore()

    // Individual action hooks
    const removeCustomer = useRemoveCustomer()
    const selectCustomer = useSelectCustomer()

    // Estado local para los diálogos
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

    // Memoized calculations to avoid recalculations
    const filteredCustomers = useMemo(() => getFilteredCustomers(), [getFilteredCustomers])

    const stats = useMemo(() => {
        const countries = [...new Set(customers.map(c => c.country))]
        const currencies = [...new Set(customers.map(c => c.invoiceCurrency))]

        return {
            totalCustomers: customers.length,
            uniqueCountries: countries.length,
            uniqueCurrencies: currencies.length,
            customersWithWebsite: customers.filter(c => c.website).length,
            topCountries: countries.map(country => ({
                country,
                count: customers.filter(c => c.country === country).length
            })).sort((a, b) => b.count - a.count).slice(0, 5),
            topCurrencies: currencies.map(currency => ({
                currency,
                count: customers.filter(c => c.invoiceCurrency === currency).length
            })).sort((a, b) => b.count - a.count).slice(0, 5)
        }
    }, [customers])

    // Handle edit customer
    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer)
        setIsEditDialogOpen(true)
    }

    // Handle create customer
    const handleCreateCustomer = () => {
        setIsCreateDialogOpen(true)
    }

    // Handle search
    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
    }

    if (customers.length === 0) {
        return (
            <>
                <CustomerEmptyState
                    variant="no-customers"
                    onCreateExample={handleCreateCustomer}
                />
                <CreateCustomerDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                />
                <EditCustomerDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    customer={editingCustomer}
                />
            </>
        )
    }

    return (
        <>
            <div className="h-full">
                {/* Header */}
                <CustomerHeader
                    stats={stats}
                    onCreateCustomer={handleCreateCustomer}
                />

                {/* Search and Filters */}
                <div className="p-6 border-b space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar clientes..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{filteredCustomers.length} cliente{filteredCustomers.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    {filteredCustomers.length === 0 ? (
                        <CustomerEmptyState
                            variant="no-results"
                            onCreateExample={handleCreateCustomer}
                        />
                    ) : (
                        <CustomerGrid
                            customers={filteredCustomers}
                            onEditCustomer={handleEditCustomer}
                            onDeleteCustomer={removeCustomer}
                            onSelectCustomer={selectCustomer}
                            selectedCustomer={selectedCustomer}
                        />
                    )}
                </div>
            </div>

            <CreateCustomerDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
            <EditCustomerDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                customer={editingCustomer}
            />
        </>
    )
}