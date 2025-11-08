import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerFilters } from '@/types/customer'

interface CustomerStore {
    // State
    customers: Customer[]
    isLoading: boolean
    error: string | null
    searchQuery: string
    selectedCustomer: Customer | null

    // Filters
    filters: CustomerFilters

    // Actions
    addCustomer: (customer: CreateCustomerDto) => void
    removeCustomer: (customerId: string) => void
    updateCustomer: (customerId: string, updates: UpdateCustomerDto) => void

    // Selection
    selectCustomer: (customer: Customer | null) => void
    getCustomerById: (customerId: string) => Customer | undefined

    // Search and filter
    setSearchQuery: (query: string) => void
    setFilters: (filters: Partial<CustomerStore['filters']>) => void
    clearFilters: () => void

    // Bulk actions
    clearAllCustomers: () => void
    exportCustomers: () => Customer[]
    importCustomers: (customers: Customer[]) => void
    bulkDeleteCustomers: (customerIds: string[]) => void

    // Helper actions
    getFilteredCustomers: () => Customer[]

    // State management
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useCustomerStore = create<CustomerStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                customers: [],
                isLoading: false,
                error: null,
                searchQuery: '',
                selectedCustomer: null,
                filters: {},

                // Actions
                addCustomer: (customerData) => {
                    const newCustomer: Customer = {
                        ...customerData,
                        id: crypto.randomUUID(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }

                    set(
                        (state) => ({
                            customers: [...state.customers, newCustomer],
                            error: null
                        }),
                        false,
                        'addCustomer'
                    )
                },

                removeCustomer: (customerId) => {
                    set(
                        (state) => {
                            const updatedCustomers = state.customers.filter(customer => customer.id !== customerId)
                            const newState = {
                                ...state,
                                customers: updatedCustomers,
                                selectedCustomer: state.selectedCustomer?.id === customerId ? null : state.selectedCustomer,
                                error: null
                            }
                            // Forzar persistencia manual
                            try {
                                localStorage.setItem('customer-store', JSON.stringify({ state: newState }))
                            } catch (e) {
                                console.error('Error forzando persistencia customer-store:', e)
                            }
                            return newState
                        },
                        false,
                        'removeCustomer'
                    )
                },

                updateCustomer: (customerId, updates) => {
                    set(
                        (state) => ({
                            ...state,
                            customers: state.customers.map(customer =>
                                customer.id === customerId
                                    ? { ...customer, ...updates, updatedAt: new Date() }
                                    : customer
                            ),
                            selectedCustomer: state.selectedCustomer?.id === customerId
                                ? { ...state.selectedCustomer, ...updates, updatedAt: new Date() }
                                : state.selectedCustomer,
                            error: null
                        }),
                        false,
                        'updateCustomer'
                    )
                },

                // Selection
                selectCustomer: (customer) => {
                    set(
                        { selectedCustomer: customer },
                        false,
                        'selectCustomer'
                    )
                },

                getCustomerById: (customerId) => {
                    const { customers } = get()
                    return customers.find(c => c.id === customerId)
                },

                // Search and filter
                setSearchQuery: (query) => {
                    set(
                        { searchQuery: query },
                        false,
                        'setSearchQuery'
                    )
                },                setFilters: (newFilters) => {
                    set(
                        (state) => ({
                            filters: { ...state.filters, ...newFilters }
                        }),
                        false,
                        'setFilters'
                    )
                },

                clearFilters: () => {
                    set(
                        { filters: {}, searchQuery: '' },
                        false,
                        'clearFilters'
                    )
                },

                // Helper functions
                getFilteredCustomers: () => {
                    const { customers, searchQuery, filters } = get()

                    return customers.filter(customer => {
                        // Search query filter
                        const matchesSearch = !searchQuery ||
                            customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            customer.city.toLowerCase().includes(searchQuery.toLowerCase())

                        // Country filter
                        const matchesCountry = !filters.country || customer.country === filters.country

                        // Currency filter
                        const matchesCurrency = !filters.currency || customer.invoiceCurrency === filters.currency

                        // Website filter
                        const matchesWebsite = filters.hasWebsite === undefined ||
                            (filters.hasWebsite ? !!customer.website : !customer.website)

                        return matchesSearch && matchesCountry && matchesCurrency && matchesWebsite
                    })
                },

                // Bulk actions
                clearAllCustomers: () => {
                    set(
                        {
                            customers: [],
                            selectedCustomer: null,
                            searchQuery: '',
                            filters: {},
                            error: null
                        },
                        false,
                        'clearAllCustomers'
                    )
                },

                exportCustomers: () => {
                    const { customers } = get()
                    return [...customers] // Return a copy
                },

                importCustomers: (customers) => {
                    // Validate and clean up imported customers
                    const validCustomers = customers.filter(customer =>
                        customer.companyName &&
                        customer.email &&
                        customer.firstName &&
                        customer.lastName &&
                        customer.country &&
                        customer.invoiceCurrency
                    ).map(customer => ({
                        ...customer,
                        id: customer.id || crypto.randomUUID(),
                        createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
                        updatedAt: customer.updatedAt ? new Date(customer.updatedAt) : new Date(),
                    }))

                    set(
                        {
                            customers: validCustomers,
                            error: null
                        },
                        false,
                        'importCustomers'
                    )
                },

                bulkDeleteCustomers: (customerIds) => {
                    set(
                        (state) => {
                            const updatedCustomers = state.customers.filter(customer => !customerIds.includes(customer.id))
                            const selectedCustomerId = state.selectedCustomer?.id
                            return {
                                ...state,
                                customers: updatedCustomers,
                                selectedCustomer: selectedCustomerId && customerIds.includes(selectedCustomerId) ? null : state.selectedCustomer,
                                error: null
                            }
                        },
                        false,
                        'bulkDeleteCustomers'
                    )
                },

                // State management
                setLoading: (loading) => {
                    set(
                        { isLoading: loading },
                        false,
                        'setLoading'
                    )
                },

                setError: (error) => {
                    set(
                        { error },
                        false,
                        'setError'
                    )
                },
            }),
            {
                name: 'customer-store',
                version: 1,
                // Add custom storage to handle Date serialization
                storage: {
                    getItem: (name) => {
                        const str = localStorage.getItem(name)
                        if (!str) return null

                        try {
                            const state = JSON.parse(str)
                            // Convert date strings back to Date objects
                            if (state.state?.customers) {
                                state.state.customers = state.state.customers.map((customer: Customer) => ({
                                    ...customer,
                                    createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
                                    updatedAt: customer.updatedAt ? new Date(customer.updatedAt) : new Date(),
                                }))
                            }
                            if (state.state?.selectedCustomer && state.state.selectedCustomer.createdAt) {
                                state.state.selectedCustomer.createdAt = new Date(state.state.selectedCustomer.createdAt)
                                state.state.selectedCustomer.updatedAt = new Date(state.state.selectedCustomer.updatedAt)
                            }
                            return state
                        } catch (error) {
                            console.error('Error parsing stored customer data:', error)
                            return null
                        }
                    },
                    setItem: (name, value) => {
                        localStorage.setItem(name, JSON.stringify(value))
                    },
                    removeItem: (name) => {
                        localStorage.removeItem(name)
                    }
                },
            }
        ),
        {
            name: 'customer-store'
        }
    )
)

// Selectors for common use cases
export const useCustomers = () => useCustomerStore(state => state.customers)

// Action hooks for better performance
export const useAddCustomer = () => useCustomerStore(state => state.addCustomer)
export const useRemoveCustomer = () => useCustomerStore(state => state.removeCustomer)
export const useUpdateCustomer = () => useCustomerStore(state => state.updateCustomer)
export const useSelectCustomer = () => useCustomerStore(state => state.selectCustomer)
export const useClearAllCustomers = () => useCustomerStore(state => state.clearAllCustomers)

// Complex selectors
export const useSelectedCustomer = () => useCustomerStore(state => state.selectedCustomer)

export const useCustomerById = (customerId: string) =>
    useCustomerStore(state => state.getCustomerById(customerId))

export const useFilteredCustomers = () =>
    useCustomerStore(state => state.getFilteredCustomers())

export const useCustomerStats = () =>
    useCustomerStore(state => {
        const { customers } = state
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
    })

// Search and filter hooks
export const useCustomerSearch = () => useCustomerStore(state => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    filters: state.filters,
    setFilters: state.setFilters,
    clearFilters: state.clearFilters
}))

// Loading and error state hooks
export const useCustomerState = () => useCustomerStore(state => ({
    isLoading: state.isLoading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError
}))