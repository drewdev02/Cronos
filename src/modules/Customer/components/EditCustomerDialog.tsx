import { useState, useEffect } from "react"
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
import { useUpdateCustomer } from "@/stores/customer-store"
import { Customer, UpdateCustomerDto } from "@/types/customer"
import { toast } from "sonner"

interface EditCustomerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer: Customer | null
}

export function EditCustomerDialog({ open, onOpenChange, customer }: EditCustomerDialogProps) {
    const [formData, setFormData] = useState<UpdateCustomerDto>({
        id: "",
        companyName: "",
        country: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        postalCode: "",
        city: "",
        website: "",
        invoiceCurrency: "",
        additionalInfo: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const updateCustomer = useUpdateCustomer()

    const countries = [
        "Estados Unidos", "España", "México", "Argentina", "Colombia", "Chile",
        "Perú", "Venezuela", "Ecuador", "Uruguay", "Paraguay", "Bolivia",
        "Costa Rica", "Panamá", "Guatemala", "Honduras", "El Salvador", "Nicaragua",
        "República Dominicana", "Cuba", "Puerto Rico", "Francia", "Alemania",
        "Reino Unido", "Italia", "Portugal", "Brasil", "Canadá", "Australia"
    ]

    const currencies = [
        "USD", "EUR", "MXN", "ARS", "COP", "CLP", "PEN", "VES", "UYU", "PYG",
        "BOB", "CRC", "PAB", "GTQ", "HNL", "SVC", "NIO", "DOP", "CUP", "GBP",
        "CAD", "AUD", "BRL", "JPY", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK"
    ]

    // Load customer data when dialog opens
    useEffect(() => {
        if (open && customer) {
            setFormData({
                id: customer.id!,
                companyName: customer.companyName,
                country: customer.country,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phoneNumber: customer.phoneNumber || "",
                addressLine1: customer.addressLine1,
                addressLine2: customer.addressLine2 || "",
                postalCode: customer.postalCode,
                city: customer.city,
                website: customer.website || "",
                invoiceCurrency: customer.invoiceCurrency,
                additionalInfo: customer.additionalInfo || ""
            })
        }
    }, [open, customer])

    const handleInputChange = (field: keyof UpdateCustomerDto, value: string) => {
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
            companyName: "Nombre de la empresa",
            country: "País",
            firstName: "Nombre",
            lastName: "Apellido",
            email: "Correo electrónico",
            addressLine1: "Dirección",
            postalCode: "Código postal",
            city: "Ciudad",
            invoiceCurrency: "Moneda de facturación"
        }

        for (const [field, label] of Object.entries(required)) {
            if (!formData[field as keyof UpdateCustomerDto]?.trim()) {
                toast.error(`${label} es requerido`)
                return false
            }
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email!)) {
            toast.error("Formato de correo electrónico inválido")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        if (!customer?.id) {
            toast.error("Cliente no encontrado")
            return
        }

        setIsLoading(true)

        try {
            // Limpiar datos opcionales vacíos
            const customerData: UpdateCustomerDto = {
                ...formData,
                phoneNumber: formData.phoneNumber?.trim() || undefined,
                addressLine2: formData.addressLine2?.trim() || undefined,
                website: formData.website?.trim() || undefined,
                additionalInfo: formData.additionalInfo?.trim() || undefined,
            }

            updateCustomer(customer.id, customerData)

            // Mostrar toast de éxito
            toast.success("Cliente actualizado exitosamente", {
                description: `"${formData.companyName}" ha sido actualizado`
            })

            // Cerrar diálogo
            onOpenChange(false)

        } catch (error) {
            toast.error("Error al actualizar el cliente", {
                description: "Hubo un problema al guardar los cambios. Intenta de nuevo."
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        // Restore original values
        if (customer) {
            setFormData({
                id: customer.id!,
                companyName: customer.companyName,
                country: customer.country,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phoneNumber: customer.phoneNumber || "",
                addressLine1: customer.addressLine1,
                addressLine2: customer.addressLine2 || "",
                postalCode: customer.postalCode,
                city: customer.city,
                website: customer.website || "",
                invoiceCurrency: customer.invoiceCurrency,
                additionalInfo: customer.additionalInfo || ""
            })
        }
        onOpenChange(false)
    }

    // If no customer is selected, don't render the dialog
    if (!customer) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-4 pb-6">
                    <DialogTitle className="text-xl font-medium">Editar cliente</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-sm font-medium">
                                Nombre de la empresa *
                            </Label>
                            <Input
                                id="companyName"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange("companyName", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium">País *</Label>
                            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar país..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* First and Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">Nombre *</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">Apellido *</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Correo electrónico *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium">Teléfono</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="addressLine1" className="text-sm font-medium">Dirección línea 1 *</Label>
                            <Input
                                id="addressLine1"
                                value={formData.addressLine1}
                                onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine2" className="text-sm font-medium">Dirección línea 2</Label>
                            <Input
                                id="addressLine2"
                                value={formData.addressLine2}
                                onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Postal Code and City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="postalCode" className="text-sm font-medium">Código postal *</Label>
                            <Input
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium">Ciudad *</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                required
                            />
                        </div>
                    </div>

                    {/* Website and Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website" className="text-sm font-medium">Sitio web</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => handleInputChange("website", e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-11"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invoiceCurrency" className="text-sm font-medium">Moneda de facturación *</Label>
                            <Select value={formData.invoiceCurrency} onValueChange={(value) => handleInputChange("invoiceCurrency", value)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Seleccionar moneda..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                        <Label htmlFor="additionalInfo" className="text-sm font-medium">Información adicional</Label>
                        <Textarea
                            id="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                            className="resize-none min-h-[80px]"
                            rows={3}
                            placeholder="Notas adicionales sobre el cliente..."
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
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-11 px-8"
                    >
                        {isLoading ? "Actualizando..." : "Guardar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}