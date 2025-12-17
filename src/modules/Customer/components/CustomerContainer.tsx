import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    useCustomerStore,
    useRemoveCustomer,
    useSelectCustomer
} from "@/stores/customer-store"
import { useState } from "react"
import { Customer } from "@/types/customer"
import { CustomerEmptyState } from "./CustomerEmptyState"
import { CreateCustomerDialog } from "./CreateCustomerDialog"
import { EditCustomerDialog } from "./EditCustomerDialog"
import { CustomerGrid } from "./CustomerGrid"

export function CustomerContainer() {
    // Use single Zustand store selector
    const {
        customers,
        selectedCustomer,
    } = useCustomerStore()

    // Individual action hooks
    const removeCustomer = useRemoveCustomer()
    const selectCustomer = useSelectCustomer()

    // Estado local para los diálogos
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

    // Handle edit customer
    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer)
        setIsEditDialogOpen(true)
    }

    // Handle create customer
    const handleCreateCustomer = () => {
        setIsCreateDialogOpen(true)
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
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h1 className="text-2xl font-semibold">Clientes</h1>
                    </div>
                    <Button onClick={handleCreateCustomer} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Cliente
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    {customers.length === 0 ? (
                        <CustomerEmptyState
                            variant="no-results"
                            onCreateExample={handleCreateCustomer}
                        />
                    ) : (
                        <CustomerGrid
                            customers={customers}
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