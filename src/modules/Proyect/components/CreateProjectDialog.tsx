import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAddProject } from "@/stores/project-store"
import { useCustomers } from "@/stores/customer-store"
import { CreateProjectDto, ProjectStatus } from "@/types/project"
import { toast } from "sonner"
import { clientCurrencies } from "@/lib/values"

interface CreateProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
    const [formData, setFormData] = useState<CreateProjectDto>({
        name: "",
        customerId: "",
        hourlyRate: 0,
        currency: "USD",
        description: "",
        status: ProjectStatus.PLANNING,
        estimatedHours: undefined
    })
    const [isLoading, setIsLoading] = useState(false)

    const addProject = useAddProject()
    const customers = useCustomers()

    const statusOptions = [
        { value: ProjectStatus.PLANNING, label: "Planificando" },
        { value: ProjectStatus.ACTIVE, label: "Activo" },
        { value: ProjectStatus.ON_HOLD, label: "En Pausa" }
    ]

    const handleInputChange = (field: keyof CreateProjectDto, value: string | number | ProjectStatus | Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            const syntheticEvent = { preventDefault: () => { } } as React.FormEvent
            handleSubmit(syntheticEvent)
        }
    }

    const validateForm = (): boolean => {
        const required = {
            name: "Nombre del proyecto",
            customerId: "Cliente",
            hourlyRate: "Rate por hora"
        }

        for (const [field, label] of Object.entries(required)) {
            const value = formData[field as keyof CreateProjectDto]
            if (!value || (typeof value === 'string' && !value.trim()) || (typeof value === 'number' && value <= 0)) {
                toast.error(`${label} es requerido`)
                return false
            }
        }

        if (formData.hourlyRate <= 0) {
            toast.error("El rate por hora debe ser mayor a 0")
            return false
        }

        if (formData.estimatedHours && formData.estimatedHours <= 0) {
            toast.error("Las horas estimadas deben ser mayores a 0")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const projectData: CreateProjectDto = {
                ...formData,
                description: formData.description?.trim() || undefined,
                estimatedHours: formData.estimatedHours || undefined,
            }

            addProject(projectData)

            const selectedCustomer = customers.find(c => c.id === formData.customerId)
            toast.success("Proyecto creado exitosamente", {
                description: `"${formData.name}" ha sido agregado para ${selectedCustomer?.companyName || 'el cliente'}`
            })

            resetForm()
            onOpenChange(false)

        } catch (error) {
            toast.error("Error al crear el proyecto", {
                description: "Hubo un problema al guardar el proyecto. Intenta de nuevo."
            })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            customerId: "",
            hourlyRate: 0,
            currency: "USD",
            description: "",
            status: ProjectStatus.PLANNING,
            estimatedHours: undefined
        })
    }

    const handleCancel = () => {
        resetForm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-4 pb-6">
                    <DialogTitle className="text-xl font-medium">Crear nuevo proyecto</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name and Customer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nombre del proyecto *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                                placeholder="Mi proyecto increíble"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customerId" className="text-sm font-medium">Cliente *</Label>
                            <Select value={formData.customerId} onValueChange={(value) => handleInputChange("customerId", value)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar cliente..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.companyName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Hourly Rate and Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate" className="text-sm font-medium">Rate por hora *</Label>
                            <Input
                                id="hourlyRate"
                                type="number"
                                value={formData.hourlyRate}
                                onChange={(e) => handleInputChange("hourlyRate", parseFloat(e.target.value) || 0)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                                min="0"
                                step="0.01"
                                placeholder="50.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency" className="text-sm font-medium">Moneda</Label>
                            <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar moneda..." />
                                </SelectTrigger>
                                <SelectContent className="bg-primary">
                                    {clientCurrencies.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Status and Estimated Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium">Estado inicial</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value as ProjectStatus)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar estado..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estimatedHours" className="text-sm font-medium">Horas estimadas</Label>
                            <Input
                                id="estimatedHours"
                                type="number"
                                value={formData.estimatedHours || ""}
                                onChange={(e) => handleInputChange("estimatedHours", parseFloat(e.target.value) || undefined)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                min="0"
                                step="0.5"
                                placeholder="40"
                            />
                        </div>
                    </div>

                    {/* Start and End Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-sm font-medium">Fecha de inicio</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ""}
                                onChange={(e) => handleInputChange("startDate", e.target.value ? new Date(e.target.value) : undefined)}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-sm font-medium">Fecha de fin</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ""}
                                onChange={(e) => handleInputChange("endDate", e.target.value ? new Date(e.target.value) : undefined)}
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="resize-none min-h-[80px]"
                            rows={3}
                            placeholder="Describe el proyecto, objetivos, características especiales..."
                        />
                    </div>
                </form>

                <DialogFooter className="gap-4 pt-6 !justify-center sm:!justify-center">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="h-11 px-8"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading || customers.length === 0}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-11 px-8"
                    >
                        {isLoading ? "Creando..." : "Crear proyecto"}
                    </Button>
                </DialogFooter>

                {customers.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Necesitas crear un cliente primero antes de poder crear proyectos.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}