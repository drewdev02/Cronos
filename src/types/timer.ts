/**
 * Estados posibles de un cronómetro
 */
export enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

/**
 * Entrada del historial que representa un período de tiempo cronometrado
 */
export interface TimerHistoryEntry {
  /** ID único de la entrada */
  id: string
  /** Timestamp cuando se inició este período */
  startTime: Date
  /** Timestamp cuando se detuvo este período (null si está corriendo) */
  endTime: Date | null
  /** Duración en milisegundos de este período */
  duration: number
  /** Notas opcionales sobre este período */
  notes?: string
}

/**
 * Configuración opcional para un cronómetro
 */
export interface TimerConfig {
  /** Si el cronómetro debe pausarse automáticamente después de cierto tiempo */
  autoPause?: {
    /** Tiempo en milisegundos después del cual se pausa automáticamente */
    after: number
    /** Si debe notificar al usuario */
    notify: boolean
  }
  /** Etiquetas para categorizar el cronómetro */
  tags?: string[]
  /** Color personalizado para el cronómetro */
  color?: string
}

/**
 * Representación completa de un cronómetro
 */
export interface Timer {
  /** ID único del cronómetro */
  id: string
  /** Título descriptivo del cronómetro */
  title: string
  /** Descripción opcional más detallada */
  description?: string
  /** Fecha y hora cuando se creó el cronómetro */
  createdAt: Date
  /** Fecha y hora de la última actualización */
  updatedAt: Date
  /** Estado actual del cronómetro */
  status: TimerStatus
  /** Historial completo de todas las sesiones de tiempo */
  history: TimerHistoryEntry[]
  /** Tiempo total acumulado en milisegundos */
  totalTime: number
  /** Configuración opcional del cronómetro */
  config?: TimerConfig
  /** Timestamp cuando se inició la sesión actual (null si no está corriendo) */
  currentSessionStart: Date | null
}

/**
 * Utilitarios para trabajar con cronómetros
 */
export interface TimerUtils {
  /** Calcula el tiempo total de todas las entradas del historial */
  calculateTotalTime: (history: TimerHistoryEntry[]) => number
  /** Obtiene la duración de la sesión actual si está corriendo */
  getCurrentSessionDuration: (timer: Timer) => number
  /** Formatea el tiempo en milisegundos a un string legible */
  formatDuration: (milliseconds: number) => string
  /** Obtiene estadísticas del cronómetro */
  getTimerStats: (timer: Timer) => TimerStats
}

/**
 * Estadísticas de un cronómetro
 */
export interface TimerStats {
  /** Número total de sesiones */
  totalSessions: number
  /** Duración promedio por sesión */
  averageSessionDuration: number
  /** Sesión más larga */
  longestSession: number
  /** Sesión más corta */
  shortestSession: number
  /** Tiempo total */
  totalTime: number
  /** Primera sesión */
  firstSession?: Date
  /** Última sesión */
  lastSession?: Date
}

/**
 * Acciones disponibles para un cronómetro
 */
export type TimerAction = 
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string }
  | { type: 'ADD_NOTES'; payload: { entryId: string; notes: string } }
  | { type: 'UPDATE_CONFIG'; payload: Partial<TimerConfig> }

/**
 * Criterios de ordenamiento para la lista de timers
 */
export enum TimerSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  TOTAL_TIME = 'totalTime',
  STATUS = 'status'
}

/**
 * Dirección de ordenamiento
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Filtros disponibles para la lista de timers
 */
export interface TimerFilters {
  /** Filtrar por estado */
  status?: TimerStatus[]
  /** Filtrar por etiquetas */
  tags?: string[]
  /** Filtrar por rango de fechas de creación */
  createdAt?: {
    from?: Date
    to?: Date
  }
  /** Filtrar por rango de tiempo total */
  totalTime?: {
    min?: number
    max?: number
  }
  /** Búsqueda por texto en título o descripción */
  searchText?: string
}

/**
 * Configuración de paginación
 */
export interface PaginationConfig {
  /** Número de página actual (empezando en 1) */
  page: number
  /** Número de elementos por página */
  pageSize: number
}

/**
 * Información de paginación resultante
 */
export interface PaginationInfo {
  /** Página actual */
  currentPage: number
  /** Total de páginas */
  totalPages: number
  /** Total de elementos */
  totalItems: number
  /** Número de elementos por página */
  pageSize: number
  /** Si hay página anterior */
  hasPreviousPage: boolean
  /** Si hay página siguiente */
  hasNextPage: boolean
}

/**
 * Configuración de ordenamiento
 */
export interface SortConfig {
  /** Campo por el cual ordenar */
  sortBy: TimerSortBy
  /** Dirección del ordenamiento */
  direction: SortDirection
}

/**
 * Representación de la lista de timers con toda su configuración
 */
export interface TimerList {
  /** Array de todos los timers */
  timers: Timer[]
  /** Configuración de filtros activos */
  filters: TimerFilters
  /** Configuración de ordenamiento */
  sort: SortConfig
  /** Configuración de paginación */
  pagination?: PaginationConfig
  /** Información de la última actualización */
  lastUpdated: Date
  /** Metadatos adicionales */
  metadata: {
    /** Total de timers sin filtros */
    totalCount: number
    /** Total de timers con filtros aplicados */
    filteredCount: number
    /** Tiempo total combinado de todos los timers */
    totalCombinedTime: number
    /** Número de timers activos (running o paused) */
    activeTimersCount: number
  }
}

/**
 * Resultado de una consulta paginada de timers
 */
export interface TimerListResult {
  /** Timers de la página actual */
  timers: Timer[]
  /** Información de paginación */
  pagination: PaginationInfo
  /** Metadatos de la consulta */
  metadata: TimerList['metadata']
}

/**
 * Acciones disponibles para la lista de timers
 */
export type TimerListAction =
  | { type: 'ADD_TIMER'; payload: Timer }
  | { type: 'REMOVE_TIMER'; payload: string } // timer ID
  | { type: 'UPDATE_TIMER'; payload: Timer }
  | { type: 'SET_FILTERS'; payload: Partial<TimerFilters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_PAGINATION'; payload: PaginationConfig }
  | { type: 'RESET_PAGINATION' }
  | { type: 'REFRESH_LIST' }

/**
 * Utilidades para trabajar con listas de timers
 */
export interface TimerListUtils {
  /** Filtra los timers según los criterios especificados */
  filterTimers: (timers: Timer[], filters: TimerFilters) => Timer[]
  /** Ordena los timers según la configuración especificada */
  sortTimers: (timers: Timer[], sort: SortConfig) => Timer[]
  /** Aplica paginación a la lista de timers */
  paginateTimers: (timers: Timer[], pagination: PaginationConfig) => TimerListResult
  /** Busca timers por texto */
  searchTimers: (timers: Timer[], searchText: string) => Timer[]
  /** Calcula metadatos de la lista */
  calculateMetadata: (timers: Timer[], filteredTimers: Timer[]) => TimerList['metadata']
  /** Obtiene estadísticas agregadas de múltiples timers */
  getAggregatedStats: (timers: Timer[]) => AggregatedTimerStats
}

/**
 * Estadísticas agregadas de múltiples timers
 */
export interface AggregatedTimerStats {
  /** Total de timers */
  totalTimers: number
  /** Tiempo total combinado */
  totalCombinedTime: number
  /** Tiempo promedio por timer */
  averageTimePerTimer: number
  /** Timer más productivo */
  mostProductiveTimer?: Timer
  /** Distribución por estado */
  statusDistribution: Record<TimerStatus, number>
  /** Top tags más utilizadas */
  topTags: Array<{ tag: string; count: number }>
  /** Actividad por día de la semana */
  weeklyActivity: Record<string, number> // 'monday', 'tuesday', etc.
  /** Promedio de sesiones por timer */
  averageSessionsPerTimer: number
}