import { z } from 'zod'

export const idSchema = z.string().min(1)

export const currencySchema = z.string().min(1)

export const clientSchema = z.object({
  id: idSchema.optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  currency: currencySchema.default('USD'),
})

export const projectSchema = z.object({
  id: idSchema.optional(),
  clientId: idSchema,
  name: z.string().min(1, 'Nombre de proyecto requerido'),
  hourlyRate: z.number().nonnegative('La tarifa debe ser positiva').default(0),
  status: z.enum(['active', 'archived']).default('active'),
})

export const taskSchema = z.object({
  id: idSchema.optional(),
  projectId: idSchema,
  name: z.string().min(1, 'Nombre de tarea requerido'),
  notes: z.string().optional(),
  totalSeconds: z.number().nonnegative().default(0),
  completed: z.boolean().default(false),
})

export const timeEntrySchema = z.object({
  id: idSchema.optional(),
  taskId: idSchema,
  startAt: z.string(),
  endAt: z.string().optional(),
  seconds: z.number().optional(),
  note: z.string().optional(),
})

export const invoiceLineSchema = z.object({
  id: idSchema.optional(),
  description: z.string().min(1),
  quantity: z.number().nonnegative().default(1),
  unitPrice: z.number().nonnegative().default(0),
  total: z.number().nonnegative().default(0),
  linkedTaskId: idSchema.optional(),
})

export const invoiceSchema = z.object({
  id: idSchema.optional(),
  clientId: idSchema,
  lines: z.array(invoiceLineSchema).default([]),
  status: z.enum(['draft', 'issued', 'paid', 'cancelled']).default('draft'),
  currency: currencySchema.default('USD'),
  subtotal: z.number().nonnegative().default(0),
  taxes: z.number().nonnegative().default(0),
  total: z.number().nonnegative().default(0),
})

export type ClientForm = z.infer<typeof clientSchema>
export type ProjectForm = z.infer<typeof projectSchema>
export type TaskForm = z.infer<typeof taskSchema>
export type TimeEntryForm = z.infer<typeof timeEntrySchema>
export type InvoiceForm = z.infer<typeof invoiceSchema>

// Note: Integrate these schemas with react-hook-form using @hookform/resolvers/zod
