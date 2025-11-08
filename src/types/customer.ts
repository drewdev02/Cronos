/**
 * Tipos relacionados con clientes
 */

export interface Customer {
  id: string
  companyName: string
  country: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  addressLine1: string
  addressLine2?: string
  postalCode: string
  city: string
  website?: string
  invoiceCurrency: string
  additionalInfo?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateCustomerDto {
  companyName: string
  country: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  addressLine1: string
  addressLine2?: string
  postalCode: string
  city: string
  website?: string
  invoiceCurrency: string
  additionalInfo?: string
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  id: string
}

export interface CustomerFilters {
  country?: string
  currency?: string
  hasWebsite?: boolean
}

export interface CustomerStats {
  totalCustomers: number
  uniqueCountries: number
  uniqueCurrencies: number
  customersWithWebsite: number
  topCountries: Array<{
    country: string
    count: number
  }>
  topCurrencies: Array<{
    currency: string
    count: number
  }>
}