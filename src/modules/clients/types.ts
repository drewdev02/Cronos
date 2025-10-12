import { z } from 'zod';

// Esquema para crear un cliente
export const createClientSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  email: z.string()
    .email('Debe ser un email válido')
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .optional()
    .or(z.literal('')),
  
  currency: z.string()
    .min(1, 'La moneda es requerida'),
  
  address: z.string()
    .optional()
    .or(z.literal('')),
  
  company: z.string()
    .optional()
    .or(z.literal(''))
});

// Esquema para editar un cliente (todos los campos son opcionales excepto el id)
export const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// Esquema para el cliente completo
export const clientSchema = createClientSchema.extend({
  id: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

// Tipos TypeScript derivados de los schemas
export type CreateClientData = z.infer<typeof createClientSchema>;
export type UpdateClientData = z.infer<typeof updateClientSchema>;
export type ClientType = z.infer<typeof clientSchema>;

// Opciones de moneda comunes
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - Dólar Americano' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'MXN', label: 'MXN - Peso Mexicano' },
  { value: 'COP', label: 'COP - Peso Colombiano' }
] as const;

export type CurrencyOption = typeof CURRENCY_OPTIONS[number];