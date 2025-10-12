// Shared reusable types for Cronos app
export type ID = string

export type Currency = 'USD' | 'EUR' | 'GBP' | 'ARS' | string

export enum ProjectStatus {
  Active = 'active',
  Archived = 'archived',
}

export enum InvoiceStatus {
  Draft = 'draft',
  Issued = 'issued',
  Paid = 'paid',
  Cancelled = 'cancelled',
}

export type Client = {
  id: ID
  name: string
  email?: string
  phone?: string
  currency: Currency
  createdAt: string
}

export type Project = {
  id: ID
  clientId: ID
  name: string
  hourlyRate: number // in client currency
  status: ProjectStatus
  createdAt: string
}

export type Task = {
  id: ID
  projectId: ID
  name: string
  notes?: string
  totalSeconds: number
  completed: boolean
  createdAt: string
}

export type TimeEntry = {
  id: ID
  taskId: ID
  startAt: string
  endAt?: string
  seconds?: number
  note?: string
}

export type InvoiceLine = {
  id: ID
  description: string
  quantity: number
  unitPrice: number
  total: number
  linkedTaskId?: ID
}

export type Invoice = {
  id: ID
  clientId: ID
  lines: InvoiceLine[]
  status: InvoiceStatus
  currency: Currency
  subtotal: number
  taxes: number
  total: number
  createdAt: string
}
