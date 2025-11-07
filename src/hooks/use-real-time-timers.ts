import { useEffect, useState } from 'react'
import { useTimers } from '@/stores/timer-store'
import { TimerStatus } from '@/types/timer'

/**
 * Hook that provides real-time updates for running timers
 * Updates every second when there are active timers
 */
export function useRealTimeTimers() {
  const timers = useTimers()
  const [, forceUpdate] = useState({})

  useEffect(() => {
    // Check if there are any running timers
    const hasRunningTimers = timers.some(timer => timer.status === TimerStatus.RUNNING)
    
    if (!hasRunningTimers) {
      return
    }

    // Update every second for running timers
    const interval = setInterval(() => {
      forceUpdate({})
    }, 1000)

    return () => clearInterval(interval)
  }, [timers])

  return timers
}

/**
 * Hook that returns the count of running timers
 */
export function useRunningTimersCount() {
  const timers = useTimers()
  return timers.filter(timer => timer.status === TimerStatus.RUNNING).length
}

/**
 * Hook that returns whether there are any active timers (running or paused)
 */
export function useHasActiveTimers() {
  const timers = useTimers()
  return timers.some(timer => 
    timer.status === TimerStatus.RUNNING || timer.status === TimerStatus.PAUSED
  )
}