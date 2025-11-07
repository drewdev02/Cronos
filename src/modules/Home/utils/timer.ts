import { Timer, TimerStatus, TimerHistoryEntry, TimerStats } from "@/types/timer"

/**
 * Safely converts a date-like value to a Date object
 */
export const safeDate = (date: Date | string | number | null | undefined): Date => {
    if (!date) {
        return new Date()
    }
    
    if (date instanceof Date) {
        return isNaN(date.getTime()) ? new Date() : date
    }
    
    const converted = new Date(date)
    return isNaN(converted.getTime()) ? new Date() : converted
}

/**
 * Formats duration in milliseconds to a human-readable string
 */
export const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
    } else {
        return `${seconds}s`
    }
}

/**
 * Formats duration in a compact format (HH:MM:SS)
 */
export const formatDurationCompact = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const hoursStr = hours.toString().padStart(2, '0')
    const minutesStr = minutes.toString().padStart(2, '0')
    const secondsStr = seconds.toString().padStart(2, '0')

    return `${hoursStr}:${minutesStr}:${secondsStr}`
}

/**
 * Gets the appropriate variant for timer status badges
 */
export const getStatusVariant = (status: TimerStatus) => {
    switch (status) {
        case TimerStatus.RUNNING:
            return 'default' // Verde usando el tema
        case TimerStatus.PAUSED:
            return 'secondary' // Amarillo/gris
        case TimerStatus.COMPLETED:
            return 'outline' // Azul outline
        default:
            return 'secondary' // Gris para idle
    }
}

/**
 * Gets a human-readable label for timer status
 */
export const getStatusLabel = (status: TimerStatus): string => {
    switch (status) {
        case TimerStatus.RUNNING:
            return 'Ejecutándose'
        case TimerStatus.PAUSED:
            return 'Pausado'
        case TimerStatus.COMPLETED:
            return 'Completado'
        default:
            return 'Inactivo'
    }
}

/**
 * Formats a date to a localized string
 */
export const formatDate = (date: Date | string | number | null | undefined): string => {
    const validDate = safeDate(date)
    
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(validDate)
}

/**
 * Formats a date with time to a localized string
 */
export const formatDateTime = (date: Date | string | number | null | undefined): string => {
    const validDate = safeDate(date)
    
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(validDate)
}

/**
 * Calculates the current session duration for a running timer
 */
export const getCurrentSessionDuration = (timer: Timer): number => {
    if (timer.status === TimerStatus.RUNNING && timer.currentSessionStart) {
        const startTime = safeDate(timer.currentSessionStart)
        return Date.now() - startTime.getTime()
    }
    return 0
}

/**
 * Calculates the total time including current session if timer is running
 */
export const getTotalTimeIncludingCurrent = (timer: Timer): number => {
    return timer.totalTime + getCurrentSessionDuration(timer)
}

/**
 * Calculates the total time from timer history entries
 */
export const calculateTotalTime = (history: TimerHistoryEntry[]): number => {
    return history.reduce((total, entry) => total + entry.duration, 0)
}

/**
 * Gets comprehensive statistics for a timer
 */
export const getTimerStats = (timer: Timer): TimerStats => {
    const { history } = timer
    const totalSessions = history.length
    
    if (totalSessions === 0) {
        return {
            totalSessions: 0,
            averageSessionDuration: 0,
            longestSession: 0,
            shortestSession: 0,
            totalTime: timer.totalTime,
        }
    }
    
    const durations = history.map(entry => entry.duration)
    const totalTime = timer.totalTime
    const averageSessionDuration = totalTime / totalSessions
    const longestSession = Math.max(...durations)
    const shortestSession = Math.min(...durations)
    
    // Safely handle date sorting with proper Date conversion
    const sortedHistory = history
        .filter(entry => entry.startTime) // Filter out entries without valid start times
        .map(entry => ({
            ...entry,
            startTime: safeDate(entry.startTime),
            endTime: entry.endTime ? safeDate(entry.endTime) : null
        }))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    
    const firstSession = sortedHistory.length > 0 ? sortedHistory[0]?.startTime : undefined
    const lastEntry = sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1] : undefined
    const lastSession = lastEntry ? (lastEntry.endTime || lastEntry.startTime) : undefined
    
    return {
        totalSessions,
        averageSessionDuration,
        longestSession,
        shortestSession,
        totalTime,
        firstSession,
        lastSession
    }
}

/**
 * Checks if a timer is currently active (running or paused)
 */
export const isTimerActive = (timer: Timer): boolean => {
    return timer.status === TimerStatus.RUNNING || timer.status === TimerStatus.PAUSED
}

/**
 * Checks if a timer can be started
 */
export const canStartTimer = (timer: Timer): boolean => {
    return timer.status === TimerStatus.IDLE || timer.status === TimerStatus.PAUSED
}

/**
 * Checks if a timer can be paused
 */
export const canPauseTimer = (timer: Timer): boolean => {
    return timer.status === TimerStatus.RUNNING
}

/**
 * Checks if a timer can be stopped
 */
export const canStopTimer = (timer: Timer): boolean => {
    return timer.status === TimerStatus.RUNNING || timer.status === TimerStatus.PAUSED
}

/**
 * Checks if a timer can be reset
 */
export const canResetTimer = (timer: Timer): boolean => {
    return timer.totalTime > 0 || timer.history.length > 0 || timer.status !== TimerStatus.IDLE
}

/**
 * Gets the color for a timer based on its configuration or status
 */
export const getTimerColor = (timer: Timer): string => {
    if (timer.config?.color) {
        return timer.config.color
    }
    
    switch (timer.status) {
        case TimerStatus.RUNNING:
            return '#22c55e' // Green
        case TimerStatus.PAUSED:
            return '#f59e0b' // Amber
        case TimerStatus.COMPLETED:
            return '#3b82f6' // Blue
        default:
            return '#6b7280' // Gray
    }
}

/**
 * Creates a new timer with default values
 */
export const createDefaultTimer = (overrides: Partial<Timer> = {}): Omit<Timer, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
        title: 'Nuevo Timer',
        description: '',
        status: TimerStatus.IDLE,
        history: [],
        totalTime: 0,
        currentSessionStart: null,
        config: {
            tags: [],
            color: '#3b82f6'
        },
        ...overrides
    }
}

/**
 * Validates a timer object
 */
export const validateTimer = (timer: unknown): timer is Timer => {
    if (!timer || typeof timer !== 'object') {
        return false
    }
    
    const t = timer as Record<string, unknown>
    return (
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        t.createdAt instanceof Date &&
        t.updatedAt instanceof Date &&
        Object.values(TimerStatus).includes(t.status as TimerStatus) &&
        Array.isArray(t.history) &&
        typeof t.totalTime === 'number' &&
        (t.currentSessionStart === null || t.currentSessionStart instanceof Date)
    )
}

/**
 * Generates a summary text for a timer
 */
export const getTimerSummary = (timer: Timer): string => {
    const stats = getTimerStats(timer)
    const totalTimeFormatted = formatDuration(stats.totalTime)
    
    if (stats.totalSessions === 0) {
        return `Sin sesiones registradas`
    }
    
    if (stats.totalSessions === 1) {
        return `1 sesión • ${totalTimeFormatted} total`
    }
    
    return `${stats.totalSessions} sesiones • ${totalTimeFormatted} total`
}

/**
 * Filters timers by search text (title and description)
 */
export const filterTimersBySearch = (timers: Timer[], searchText: string): Timer[] => {
    if (!searchText.trim()) {
        return timers
    }
    
    const search = searchText.toLowerCase().trim()
    return timers.filter(timer => 
        timer.title.toLowerCase().includes(search) ||
        (timer.description && timer.description.toLowerCase().includes(search)) ||
        (timer.config?.tags && timer.config.tags.some(tag => tag.toLowerCase().includes(search)))
    )
}

/**
 * Sorts timers by different criteria
 */
export const sortTimers = (timers: Timer[], sortBy: 'title' | 'createdAt' | 'updatedAt' | 'totalTime' | 'status', direction: 'asc' | 'desc' = 'asc'): Timer[] => {
    const sortedTimers = [...timers].sort((a, b) => {
        let aValue: string | number
        let bValue: string | number
        
        switch (sortBy) {
            case 'title':
                aValue = a.title.toLowerCase()
                bValue = b.title.toLowerCase()
                break
            case 'createdAt':
                aValue = a.createdAt.getTime()
                bValue = b.createdAt.getTime()
                break
            case 'updatedAt':
                aValue = a.updatedAt.getTime()
                bValue = b.updatedAt.getTime()
                break
            case 'totalTime':
                aValue = a.totalTime
                bValue = b.totalTime
                break
            case 'status':
                aValue = a.status
                bValue = b.status
                break
            default:
                return 0
        }
        
        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1
        }
        return 0
    })
    
    return sortedTimers
}