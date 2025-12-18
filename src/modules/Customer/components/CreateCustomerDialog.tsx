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
import { useAddCustomer } from "@/stores/customer-store"
import { CreateCustomerDto } from "@/types/customer"
import { toast } from "sonner"
import { countries, currencies } from "@/lib/values"

interface CreateCustomerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateCustomerDialog({ open, onOpenChange }: CreateCustomerDialogProps) {
    const [formData, setFormData] = useState<CreateCustomerDto>({
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

    const addCustomer = useAddCustomer()

    const handleInputChange = (field: keyof CreateCustomerDto, value: string) => {
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
            email: "Correo electrónico"
        }

        for (const [field, label] of Object.entries(required)) {
            if (!formData[field as keyof CreateCustomerDto]?.trim()) {
                toast.error(`${label} es requerido`)
                return false
            }
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
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

        setIsLoading(true)

        try {
            // Limpiar datos opcionales vacíos
            const customerData: CreateCustomerDto = {
                ...formData,
                phoneNumber: formData.phoneNumber?.trim() || undefined,
                addressLine2: formData.addressLine2?.trim() || undefined,
                website: formData.website?.trim() || undefined,
                additionalInfo: formData.additionalInfo?.trim() || undefined,
            }

            addCustomer(customerData)

            // Mostrar toast de éxito
            toast.success("Cliente creado exitosamente", {
                description: `"${formData.companyName}" ha sido agregado a tu lista`
            })

            // Limpiar formulario y cerrar diálogo
            resetForm()
            onOpenChange(false)

        } catch (error) {
            toast.error("Error al crear el cliente", {
                description: "Hubo un problema al guardar el cliente. Intenta de nuevo."
            })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
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
    }

    const handleCancel = () => {
        resetForm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader className="space-y-4 pb-6">
                    <DialogTitle className="text-xl font-medium">Crear nuevo cliente</DialogTitle>
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
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium">País</Label>
                            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar país..." />
                                </SelectTrigger>
                                <SelectContent className="bg-secondary max-h-80">
                                    {countries.map((country) => (
                                        <SelectItem key={country} value={country} className="cursor-pointer data-[state=checked]:bg-secondary/80">
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
                            <Label htmlFor="firstName" className="text-sm font-medium">Nombre</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">Apellido</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                onKeyDown={handleKeyDown}
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
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="addressLine1" className="text-sm font-medium">Dirección línea 1</Label>
                            <Input
                                id="addressLine1"
                                value={formData.addressLine1}
                                onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine2" className="text-sm font-medium">Dirección línea 2</Label>
                            <Input
                                id="addressLine2"
                                value={formData.addressLine2}
                                onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>

                    {/* Postal Code and City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="postalCode" className="text-sm font-medium">Código postal</Label>
                            <Input
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium">Ciudad</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                onKeyDown={handleKeyDown}
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
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invoiceCurrency" className="text-sm font-medium">Moneda de facturación</Label>
                            <Select value={formData.invoiceCurrency} onValueChange={(value) => handleInputChange("invoiceCurrency", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar moneda..." />
                                </SelectTrigger>
                                <SelectContent className="bg-secondary">
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency} value={currency} className="cursor-pointer">
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
                            className="resize-none min-h-20"
                            rows={3}
                            placeholder="Notas adicionales sobre el cliente..."
                        />
                    </div>
                </form>

                <DialogFooter className="flex flex-row gap-4 pt-6 justify-center!">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        {isLoading ? "Creando..." : "Crear cliente"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}