import { z } from 'zod';

// Enums for task status and timer states
export enum TaskStatus {
  Active = 'active',
  Completed = 'completed',
  Paused = 'paused',
  Cancelled = 'cancelled'
}

export enum TimerStatus {
  Stopped = 'stopped',
  Running = 'running',
  Paused = 'paused'
}

// Esquema para crear una tarea
export const createTaskSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  projectId: z.string()
    .min(1, 'Debe seleccionar un proyecto'),
  
  description: z.string().default(''),
  
  estimatedHours: z.number()
    .min(0, 'Las horas estimadas no pueden ser negativas')
    .max(1000, 'Las horas estimadas no pueden exceder 1,000')
    .optional(),
  
  status: z.nativeEnum(TaskStatus).default(TaskStatus.Active)
});

// Esquema para editar una tarea
export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido'),
  totalTime: z.number().min(0).optional(),
  isInvoiced: z.boolean().optional(),
  invoiceId: z.string().optional(),
  completedAt: z.string().optional()
});

// Esquema para registros de tiempo
export const timeRecordSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  startTime: z.string(), // ISO string
  endTime: z.string().optional(), // ISO string
  duration: z.number().min(0), // in milliseconds
  description: z.string().default(''),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

// Esquema para crear un registro de tiempo manual
export const createTimeRecordSchema = z.object({
  taskId: z.string().min(1, 'ID de tarea es requerido'),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().default('')
});

// Esquema para editar tiempo manualmente
export const updateTimeRecordSchema = z.object({
  id: z.string().min(1, 'ID es requerido'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().optional()
});

// Esquema para la tarea completa
export const taskSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  projectId: z.string(),
  description: z.string().optional(),
  estimatedHours: z.number().optional(),
  totalTime: z.number().default(0), // in milliseconds
  status: z.nativeEnum(TaskStatus),
  isInvoiced: z.boolean().default(false),
  invoiceId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  completedAt: z.string().optional()
});

// Estado del cronómetro
export const timerStateSchema = z.object({
  status: z.nativeEnum(TimerStatus),
  taskId: z.string().optional(),
  startTime: z.string().optional(), // ISO string
  elapsedTime: z.number().default(0), // in milliseconds
  lastUpdateTime: z.string().optional() // ISO string for calculating elapsed time
});

// Tipos TypeScript derivados de los schemas
export type CreateTaskData = z.infer<typeof createTaskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;
export type TaskType = z.infer<typeof taskSchema>;
export type TimeRecordType = z.infer<typeof timeRecordSchema>;
export type CreateTimeRecordData = z.infer<typeof createTimeRecordSchema>;
export type UpdateTimeRecordData = z.infer<typeof updateTimeRecordSchema>;
export type TimerState = z.infer<typeof timerStateSchema>;

// Tipo extendido para tareas con información del proyecto
export type TaskWithProject = TaskType & {
  project: {
    id: string;
    name: string;
    clientId: string;
    client: {
      id: string;
      name: string;
      currency: string;
    };
    hourlyRate: number;
  };
  timeRecords: TimeRecordType[];
};

// Tipo para resumen de tiempo de tareas
export type TaskTimeSummary = {
  taskId: string;
  taskName: string;
  projectName: string;
  clientName: string;
  totalTime: number; // in milliseconds
  hourlyRate: number;
  totalAmount: number;
  isInvoiced: boolean;
  lastWorked: string; // ISO string
};

// Tipo para estado del timer con información adicional
export type TimerStateWithTask = TimerState & {
  task?: TaskWithProject;
  formattedTime: string; // HH:MM:SS format
};

// Utilidades para formateo de tiempo
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Convertir tiempo formateado a millisegundos
export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.length !== 3) throw new Error('Formato de tiempo inválido');
  
  const [hours, minutes, seconds] = parts;
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

// Calcular tiempo transcurrido desde un timestamp
export const calculateElapsedTime = (startTime: string, currentTime?: string): number => {
  const start = new Date(startTime).getTime();
  const current = currentTime ? new Date(currentTime).getTime() : Date.now();
  return Math.max(0, current - start);
};