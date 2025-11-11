import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Timer, TimerStatus } from '@/types/timer'
import { useProjectStore } from '@/stores/project-store'

interface TimerStore {
  // State
  timers: Timer[]
  intervals: Map<string, NodeJS.Timeout> // Para manejar los intervalos de cada timer

  // Actions
  addTimer: (timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'>) => void
  removeTimer: (timerId: string) => void
  updateTimer: (timerId: string, updates: Partial<Timer>) => void
  updateTimerProject: (timerId: string, projectId: string | undefined) => void

  // Timer control actions
  startTimer: (timerId: string) => void
  pauseTimer: (timerId: string) => void
  stopTimer: (timerId: string) => void
  resetTimer: (timerId: string) => void

  // Helper actions
  createExampleTimer: () => void
  getTimerById: (timerId: string) => Timer | undefined
  getTimerEarnings: (timerId: string) => number
  getCurrentSessionEarnings: (timerId: string) => number

  // Bulk actions
  clearAllTimers: () => void
  exportTimers: () => Timer[]
  importTimers: (timers: Timer[]) => void

  // Internal actions for timer management
  startTimerInterval: (timerId: string) => void
  clearTimerInterval: (timerId: string) => void
  clearAllIntervals: () => void
}

export const useTimerStore = create<TimerStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        timers: [],
        intervals: new Map<string, NodeJS.Timeout>(),

        // Internal actions for timer management
        startTimerInterval: (timerId) => {
          const { intervals, clearTimerInterval } = get()

          // Ensure intervals is a Map
          if (!(intervals instanceof Map)) {
            console.warn('Intervals is not a Map, reinitializing...')
            set(
              (state) => ({ ...state, intervals: new Map() }),
              false,
              'reinitializeMap'
            )
            return
          }

          // Limpiar intervalo existente si existe
          clearTimerInterval(timerId)

          // Crear nuevo intervalo que actualiza el store cada segundo
          const interval = setInterval(() => {
            set(
              (state) => ({
                ...state,
                timers: state.timers.map(timer =>
                  timer.id === timerId && timer.status === TimerStatus.RUNNING
                    ? { ...timer, updatedAt: new Date() } // Forzar actualización
                    : timer
                )
              }),
              false,
              'timerInterval'
            )
          }, 1000)

          // Guardar referencia del intervalo
          intervals.set(timerId, interval)

          set(
            (state) => ({ ...state, intervals: new Map(intervals) }),
            false,
            'setInterval'
          )
        },

        clearTimerInterval: (timerId) => {
          const { intervals } = get()

          // Ensure intervals is a Map
          if (!(intervals instanceof Map)) {
            console.warn('Intervals is not a Map, reinitializing...')
            set(
              (state) => ({ ...state, intervals: new Map() }),
              false,
              'reinitializeMap'
            )
            return
          }

          const interval = intervals.get(timerId)

          if (interval) {
            clearInterval(interval)
            intervals.delete(timerId)

            set(
              (state) => ({ ...state, intervals: new Map(intervals) }),
              false,
              'clearInterval'
            )
          }
        },

        clearAllIntervals: () => {
          const { intervals } = get()

          // Ensure intervals is a Map
          if (!(intervals instanceof Map)) {
            console.warn('Intervals is not a Map, reinitializing...')
            set(
              (state) => ({ ...state, intervals: new Map() }),
              false,
              'reinitializeMap'
            )
            return
          }

          // Limpiar todos los intervalos
          intervals.forEach((interval) => clearInterval(interval))
          intervals.clear()

          set(
            (state) => ({ ...state, intervals: new Map() }),
            false,
            'clearAllIntervals'
          )
        },

        // Actions
        addTimer: (timerData) => {
          const newTimer: Timer = {
            ...timerData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: TimerStatus.IDLE,
            history: [],
            totalTime: 0,
            currentSessionStart: null,
          }

          set(
            (state) => ({
              timers: [...state.timers, newTimer]
            }),
            false,
            'addTimer'
          )
        },

        removeTimer: (timerId) => {
          const { clearTimerInterval } = get()

          // Limpiar el intervalo si existe antes de remover el timer
          clearTimerInterval(timerId)

          set(
            (state) => ({
              ...state,
              timers: state.timers.filter(timer => timer.id !== timerId)
            }),
            false,
            'removeTimer'
          )
        },

        updateTimer: (timerId, updates) => {
          set(
            (state) => ({
              timers: state.timers.map(timer =>
                timer.id === timerId
                  ? { ...timer, ...updates, updatedAt: new Date() }
                  : timer
              )
            }),
            false,
            'updateTimer'
          )
        },

        // Timer control actions
        startTimer: (timerId) => {
          const { timers, startTimerInterval } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || timer.status === TimerStatus.RUNNING) return

          set(
            (state) => ({
              ...state,
              timers: state.timers.map(t =>
                t.id === timerId
                  ? {
                    ...t,
                    status: TimerStatus.RUNNING,
                    currentSessionStart: new Date(),
                    updatedAt: new Date()
                  }
                  : t
              )
            }),
            false,
            'startTimer'
          )

          // Iniciar el intervalo para actualizar el store cada segundo
          startTimerInterval(timerId)
        },

        pauseTimer: (timerId) => {
          const { timers, clearTimerInterval } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || timer.status !== TimerStatus.RUNNING) return

          // Limpiar el intervalo ya que el timer se pausa
          clearTimerInterval(timerId)

          const now = new Date()
          const sessionDuration = timer.currentSessionStart
            ? now.getTime() - timer.currentSessionStart.getTime()
            : 0

          // Calcular earnings
          let earnings = 0
          if (timer.projectId) {
            const projectStore = useProjectStore.getState()
            const project = projectStore.getProjectById(timer.projectId)
            if (project) {
              const sessionHours = sessionDuration / (1000 * 60 * 60)
              earnings = sessionHours * project.hourlyRate
            }
          }

          const newHistoryEntry = {
            id: crypto.randomUUID(),
            startTime: timer.currentSessionStart || now,
            endTime: now,
            duration: sessionDuration,
            earnings
          }

          set(
            (state) => ({
              ...state,
              timers: state.timers.map(t =>
                t.id === timerId
                  ? {
                    ...t,
                    status: TimerStatus.PAUSED,
                    totalTime: t.totalTime + sessionDuration,
                    currentSessionStart: null,
                    updatedAt: now,
                    history: [...t.history, newHistoryEntry]
                  }
                  : t
              )
            }),
            false,
            'pauseTimer'
          )
        },

        stopTimer: (timerId) => {
          const { timers, clearTimerInterval } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || (timer.status !== TimerStatus.RUNNING && timer.status !== TimerStatus.PAUSED)) {
            return
          }

          // Limpiar el intervalo si existe
          clearTimerInterval(timerId)

          const now = new Date()
          let sessionDuration = 0
          let newHistory = [...timer.history]

          // If timer is currently running, add the current session to history
          if (timer.status === TimerStatus.RUNNING && timer.currentSessionStart) {
            sessionDuration = now.getTime() - timer.currentSessionStart.getTime()
            // Calcular earnings
            let earnings = 0
            if (timer.projectId) {
              const projectStore = useProjectStore.getState()
              const project = projectStore.getProjectById(timer.projectId)
              if (project) {
                const sessionHours = sessionDuration / (1000 * 60 * 60)
                earnings = sessionHours * project.hourlyRate
              }
            }
            newHistory = [
              ...timer.history,
              {
                id: crypto.randomUUID(),
                startTime: timer.currentSessionStart,
                endTime: now,
                duration: sessionDuration,
                earnings
              }
            ]
          }

          set(
            (state) => ({
              ...state,
              timers: state.timers.map(t =>
                t.id === timerId
                  ? {
                    ...t,
                    status: TimerStatus.COMPLETED,
                    totalTime: t.totalTime + sessionDuration,
                    currentSessionStart: null,
                    updatedAt: now,
                    history: newHistory
                  }
                  : t
              )
            }),
            false,
            'stopTimer'
          )
        },

        resetTimer: (timerId) => {
          const { clearTimerInterval } = get()

          // Limpiar el intervalo si existe
          clearTimerInterval(timerId)

          set(
            (state) => ({
              ...state,
              timers: state.timers.map(t =>
                t.id === timerId
                  ? {
                    ...t,
                    status: TimerStatus.IDLE,
                    totalTime: 0,
                    currentSessionStart: null,
                    history: [],
                    updatedAt: new Date()
                  }
                  : t
              )
            }),
            false,
            'resetTimer'
          )
        },

        // Helper actions
        createExampleTimer: () => {
          const { timers, addTimer } = get()
          const exampleTimer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `Timer ${timers.length + 1}`,
            description: `Descripción del timer ${timers.length + 1}`,
            status: TimerStatus.IDLE,
            history: [],
            totalTime: Math.floor(Math.random() * 3600000), // Random time up to 1 hour
            currentSessionStart: null,
            config: {
              tags: ['trabajo', 'proyecto'],
              color: '#3b82f6'
            }
          }
          addTimer(exampleTimer)
        },

        getTimerById: (timerId) => {
          const { timers } = get()
          return timers.find(t => t.id === timerId)
        },

        updateTimerProject: (timerId, projectId) => {
          set(
            (state) => ({
              timers: state.timers.map(timer =>
                timer.id === timerId
                  ? { ...timer, projectId, updatedAt: new Date() }
                  : timer
              )
            }),
            false,
            'updateTimerProject'
          )
        },

        getTimerEarnings: (timerId) => {
          const { timers } = get()
          const timer = timers.find(t => t.id === timerId)
          
          if (!timer || !timer.projectId) return 0

          // Get the project from the store
          const projectStore = useProjectStore.getState()
          const project = projectStore.getProjectById(timer.projectId)
          
          if (!project) return 0

          // Calculate earnings: (total time in hours) * hourly rate
          const totalHours = timer.totalTime / (1000 * 60 * 60)
          return totalHours * project.hourlyRate
        },

        getCurrentSessionEarnings: (timerId) => {
          const { timers } = get()
          const timer = timers.find(t => t.id === timerId)
          
          if (!timer || !timer.projectId || !timer.currentSessionStart) return 0

          // Get the project from the store
          const projectStore = useProjectStore.getState()
          const project = projectStore.getProjectById(timer.projectId)
          
          if (!project) return 0

          // Calculate current session duration
          const now = new Date().getTime()
          const sessionDuration = now - timer.currentSessionStart.getTime()
          
          // Calculate earnings: (session time in hours) * hourly rate
          const sessionHours = sessionDuration / (1000 * 60 * 60)
          return sessionHours * project.hourlyRate
        },

        // Bulk actions
        clearAllTimers: () => {
          const { clearAllIntervals } = get()

          // Limpiar todos los intervalos antes de limpiar los timers
          clearAllIntervals()

          set(
            { timers: [], intervals: new Map() },
            false,
            'clearAllTimers'
          )
        },

        exportTimers: () => {
          const { timers } = get()
          return [...timers] // Return a copy
        },

        importTimers: (timers) => {
          const { clearAllIntervals, startTimerInterval } = get()

          // Limpiar todos los intervalos existentes
          clearAllIntervals()

          // Validate and clean up imported timers
          const validTimers = timers.filter(timer =>
            timer.id &&
            timer.title &&
            timer.createdAt &&
            Object.values(TimerStatus).includes(timer.status)
          ).map(timer => ({
            ...timer,
            createdAt: new Date(timer.createdAt),
            updatedAt: new Date(timer.updatedAt),
            currentSessionStart: timer.currentSessionStart ? new Date(timer.currentSessionStart) : null,
            history: timer.history.map(entry => ({
              ...entry,
              startTime: new Date(entry.startTime),
              endTime: entry.endTime ? new Date(entry.endTime) : null
            }))
          }))

          set(
            { timers: validTimers, intervals: new Map() },
            false,
            'importTimers'
          )

          // Reanudar intervalos para timers que están corriendo
          validTimers.forEach(timer => {
            if (timer.status === TimerStatus.RUNNING) {
              startTimerInterval(timer.id)
            }
          })
        }
      }),
      {
        name: 'timer-store',
        version: 1,
        // Add custom storage to handle Date serialization
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name)
            if (!str) return null

            try {
              const state = JSON.parse(str)
              // Convert date strings back to Date objects
              if (state.state?.timers) {
                state.state.timers = state.state.timers.map((timer: Timer) => ({
                  ...timer,
                  createdAt: timer.createdAt ? new Date(timer.createdAt) : new Date(),
                  updatedAt: timer.updatedAt ? new Date(timer.updatedAt) : new Date(),
                  currentSessionStart: timer.currentSessionStart ? new Date(timer.currentSessionStart) : null,
                  history: (timer.history || []).map((entry) => ({
                    ...entry,
                    startTime: entry.startTime ? new Date(entry.startTime) : new Date(),
                    endTime: entry.endTime ? new Date(entry.endTime) : null
                  }))
                }))
              }
              // Ensure intervals is always a Map
              if (state.state) {
                state.state.intervals = new Map()
              }
              return state
            } catch (error) {
              console.error('Error parsing stored timer data:', error)
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
        // Callback after rehydration to restart intervals for running timers
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Ensure intervals is a Map after rehydration
            state.intervals = new Map()

            // Restart intervals for running timers
            if (state.timers) {
              state.timers.forEach(timer => {
                if (timer.status === TimerStatus.RUNNING) {
                  state.startTimerInterval(timer.id)
                }
              })
            }
          }
        }
      }
    ),
    {
      name: 'timer-store'
    }
  )
)

// Selectors for common use cases
export const useTimers = () => useTimerStore(state => state.timers)

// Use individual action hooks instead of a grouped one to avoid object recreation
export const useAddTimer = () => useTimerStore(state => state.addTimer)
export const useRemoveTimer = () => useTimerStore(state => state.removeTimer)
export const useUpdateTimer = () => useTimerStore(state => state.updateTimer)
export const useUpdateTimerProject = () => useTimerStore(state => state.updateTimerProject)
export const useStartTimer = () => useTimerStore(state => state.startTimer)
export const usePauseTimer = () => useTimerStore(state => state.pauseTimer)
export const useStopTimer = () => useTimerStore(state => state.stopTimer)
export const useResetTimer = () => useTimerStore(state => state.resetTimer)
export const useCreateExampleTimer = () => useTimerStore(state => state.createExampleTimer)
export const useClearAllTimers = () => useTimerStore(state => state.clearAllTimers)

export const useTimerById = (timerId: string) =>
  useTimerStore(state => state.getTimerById(timerId))

export const useRunningTimers = () =>
  useTimerStore(state => state.timers.filter(t => t.status === TimerStatus.RUNNING))

export const useTimerStats = () =>
  useTimerStore(state => {
    const { timers } = state
    return {
      totalTimers: timers.length,
      runningTimers: timers.filter(t => t.status === TimerStatus.RUNNING).length,
      pausedTimers: timers.filter(t => t.status === TimerStatus.PAUSED).length,
      completedTimers: timers.filter(t => t.status === TimerStatus.COMPLETED).length,
      totalTime: timers.reduce((acc, timer) => acc + timer.totalTime, 0)
    }
  })

export const useTimerEarnings = (timerId: string) =>
  useTimerStore(state => state.getTimerEarnings(timerId))

export const useCurrentSessionEarnings = (timerId: string) =>
  useTimerStore(state => state.getCurrentSessionEarnings(timerId))