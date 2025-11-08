/**
 * Tipos relacionados con proyectos
 */

import type { Timer } from './timer'
import type { Customer } from './customer'

export interface Project {
  id: string
  name: string
  customerId: string
  customer?: Customer // Información completa del cliente (populated)
  timerIds: string[] // IDs de los timers asociados
  timers?: Timer[] // Información completa de los timers (populated)
  hourlyRate: number // Rate por hora
  currency: string // Moneda del rate
  description?: string
  status: ProjectStatus
  startDate?: Date
  endDate?: Date
  estimatedHours?: number
  totalTimeSpent?: number // En milisegundos, calculado desde los timers
  totalBilled?: number // Cantidad total facturada
  createdAt: Date
  updatedAt: Date
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface CreateProjectDto {
  name: string
  customerId: string
  hourlyRate: number
  currency: string
  description?: string
  status?: ProjectStatus
  startDate?: Date
  endDate?: Date
  estimatedHours?: number
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  id: string
}

export interface ProjectFilters {
  customerId?: string
  status?: ProjectStatus[]
  currency?: string
  hourlyRateRange?: {
    min?: number
    max?: number
  }
  dateRange?: {
    from?: Date
    to?: Date
  }
  hasActiveTimers?: boolean
}

export interface ProjectStats {
  totalProjects: number
  projectsByStatus: Record<ProjectStatus, number>
  totalTimeSpent: number // En milisegundos
  totalBilled: number
  averageHourlyRate: number
  totalActiveProjects: number
  totalCompletedProjects: number
  topCustomers: Array<{
    customerId: string
    customerName: string
    projectCount: number
    totalTimeSpent: number
    totalBilled: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    hoursWorked: number
  }>
  projectsWithOvertime: number // Proyectos que superaron las horas estimadas
  averageProjectDuration: number // En días
}

/**
 * Datos del proyecto con información calculada
 */
export interface ProjectWithMetrics extends Project {
  // Métricas calculadas
  totalTimeSpent: number
  totalBilled: number
  activeTimersCount: number
  completedTimersCount: number
  totalTimersCount: number
  efficiencyRate: number // Porcentaje de tiempo estimado vs real
  profitabilityScore: number // Score basado en rate vs tiempo invertido
  progress: number // Porcentaje de progreso (0-100)
  
  // Fechas importantes
  lastActivity?: Date
  nextMilestone?: Date
  
  // Estado de alertas
  isOverBudget: boolean
  isOverdue: boolean
  needsAttention: boolean
}

/**
 * Configuración de ordenamiento para proyectos
 */
export enum ProjectSortBy {
  NAME = 'name',
  CUSTOMER = 'customer',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  HOURLY_RATE = 'hourlyRate',
  TOTAL_TIME = 'totalTimeSpent',
  TOTAL_BILLED = 'totalBilled',
  START_DATE = 'startDate',
  END_DATE = 'endDate'
}

export interface ProjectSortConfig {
  sortBy: ProjectSortBy
  direction: 'asc' | 'desc'
}

/**
 * Resultado de búsqueda de proyectos
 */
export interface ProjectSearchResult {
  projects: ProjectWithMetrics[]
  totalCount: number
  filteredCount: number
  stats: ProjectStats
}

/**
 * Acciones de proyecto para el timeline/historial
 */
export interface ProjectAction {
  id: string
  projectId: string
  type: ProjectActionType
  description: string
  metadata?: Record<string, unknown>
  createdAt: Date
  createdBy?: string
}

export enum ProjectActionType {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  TIMER_ADDED = 'timer_added',
  TIMER_REMOVED = 'timer_removed',
  TIMER_STARTED = 'timer_started',
  TIMER_STOPPED = 'timer_stopped',
  BILLED = 'billed',
  NOTE_ADDED = 'note_added'
}

/**
 * Configuración de facturación para proyectos
 */
export interface ProjectBilling {
  id: string
  projectId: string
  amount: number
  currency: string
  description: string
  billedHours: number
  hourlyRate: number
  billedAt: Date
  invoiceNumber?: string
  paymentStatus: PaymentStatus
  dueDate?: Date
  paidAt?: Date
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

/**
 * Template para crear proyectos rápidamente
 */
export interface ProjectTemplate {
  id: string
  name: string
  description: string
  defaultHourlyRate: number
  defaultCurrency: string
  estimatedHours: number
  status: ProjectStatus
  tags: string[]
  milestones: Array<{
    name: string
    description: string
    estimatedHours: number
  }>
}