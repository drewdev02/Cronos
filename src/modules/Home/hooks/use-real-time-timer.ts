import { useEffect, useState } from 'react'
import { Timer, TimerStatus } from '@/types/timer'

/**
 * Custom hook that forces re-renders every second for running timers
 * to enable real-time display updates
 */
export function useRealTimeTimer(timer: Timer) {
    const [forceUpdate, setForceUpdate] = useState(0)

    useEffect(() => {
        // Only set up interval if timer is running
        if (timer.status !== TimerStatus.RUNNING) {
            return
        }

        // Set up interval to force re-render every second
        const interval = setInterval(() => {
            setForceUpdate(prev => prev + 1)
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [timer.status, timer.id]) // Re-run when timer status changes or timer changes

    return forceUpdate
}