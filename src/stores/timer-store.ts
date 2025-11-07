import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Timer, TimerStatus } from '@/types/timer'

interface TimerStore {
  // State
  timers: Timer[]

  // Actions
  addTimer: (timer: Omit<Timer, 'id' | 'createdAt' | 'updatedAt'>) => void
  removeTimer: (timerId: string) => void
  updateTimer: (timerId: string, updates: Partial<Timer>) => void

  // Timer control actions
  startTimer: (timerId: string) => void
  pauseTimer: (timerId: string) => void
  stopTimer: (timerId: string) => void
  resetTimer: (timerId: string) => void

  // Helper actions
  createExampleTimer: () => void
  getCurrentSessionDuration: (timerId: string) => number
  getTimerById: (timerId: string) => Timer | undefined

  // Bulk actions
  clearAllTimers: () => void
  exportTimers: () => Timer[]
  importTimers: (timers: Timer[]) => void
}

export const useTimerStore = create<TimerStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        timers: [],

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
          set(
            (state) => ({
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
          const { timers } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || timer.status === TimerStatus.RUNNING) return

          set(
            (state) => ({
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
        },

        pauseTimer: (timerId) => {
          const { timers } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || timer.status !== TimerStatus.RUNNING) return

          const now = new Date()
          const sessionDuration = timer.currentSessionStart
            ? now.getTime() - timer.currentSessionStart.getTime()
            : 0

          const newHistoryEntry = {
            id: crypto.randomUUID(),
            startTime: timer.currentSessionStart || now,
            endTime: now,
            duration: sessionDuration
          }

          set(
            (state) => ({
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
          const { timers } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || (timer.status !== TimerStatus.RUNNING && timer.status !== TimerStatus.PAUSED)) {
            return
          }

          const now = new Date()
          let sessionDuration = 0
          let newHistory = [...timer.history]

          // If timer is currently running, add the current session to history
          if (timer.status === TimerStatus.RUNNING && timer.currentSessionStart) {
            sessionDuration = now.getTime() - timer.currentSessionStart.getTime()
            newHistory = [
              ...timer.history,
              {
                id: crypto.randomUUID(),
                startTime: timer.currentSessionStart,
                endTime: now,
                duration: sessionDuration
              }
            ]
          }

          set(
            (state) => ({
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
          set(
            (state) => ({
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

        getCurrentSessionDuration: (timerId) => {
          const { timers } = get()
          const timer = timers.find(t => t.id === timerId)

          if (!timer || timer.status !== TimerStatus.RUNNING || !timer.currentSessionStart) {
            return 0
          }

          return Date.now() - timer.currentSessionStart.getTime()
        },

        getTimerById: (timerId) => {
          const { timers } = get()
          return timers.find(t => t.id === timerId)
        },

        // Bulk actions
        clearAllTimers: () => {
          set(
            { timers: [] },
            false,
            'clearAllTimers'
          )
        },

        exportTimers: () => {
          const { timers } = get()
          return [...timers] // Return a copy
        },

        importTimers: (timers) => {
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
            { timers: validTimers },
            false,
            'importTimers'
          )
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
export const useStartTimer = () => useTimerStore(state => state.startTimer)
export const usePauseTimer = () => useTimerStore(state => state.pauseTimer)
export const useStopTimer = () => useTimerStore(state => state.stopTimer)
export const useResetTimer = () => useTimerStore(state => state.resetTimer)
export const useCreateExampleTimer = () => useTimerStore(state => state.createExampleTimer)
export const useClearAllTimers = () => useTimerStore(state => state.clearAllTimers)

export const useTimerById = (timerId: string) =>
  useTimerStore(state => state.timers.find(t => t.id === timerId))

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