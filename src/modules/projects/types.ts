import { z } from 'zod';
import { ProjectStatus } from '../../types';

// Esquema para crear un proyecto
export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  clientId: z.string()
    .min(1, 'Debe seleccionar un cliente'),
  
  hourlyRate: z.number()
    .min(0.01, 'La tarifa por hora debe ser mayor a 0')
    .max(10000, 'La tarifa por hora no puede exceder 10,000'),
  
  description: z.string().default(''),
  
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.Active)
});

// Esquema para editar un proyecto
export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido')
});

// Esquema para el proyecto completo
export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  clientId: z.string(),
  hourlyRate: z.number(),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

// Tipos TypeScript derivados de los schemas
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;
export type ProjectType = z.infer<typeof projectSchema>;

// Tipo extendido para proyectos con información del cliente
export type ProjectWithClient = ProjectType & {
  client: {
    id: string;
    name: string;
    currency: string;
  };
};

// Tipo para el resumen de proyecto
export type ProjectSummary = {
  id: string;
  name: string;
  client: {
    id: string;
    name: string;
    currency: string;
  };
  hourlyRate: number;
  status: ProjectStatus;
  totalHours: number;
  totalTasks: number;
  completedTasks: number;
  estimatedCost: number;
  actualCost: number;
  createdAt: string;
};

// Estados para filtros
export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.Active, label: 'Activo' },
  { value: ProjectStatus.Archived, label: 'Archivado' }
] as const;