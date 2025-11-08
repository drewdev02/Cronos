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