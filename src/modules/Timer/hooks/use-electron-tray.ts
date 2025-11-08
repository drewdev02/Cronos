import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timer-store.ts'
import { TimerStatus } from '@/types/timer.ts'

export const useElectronTray = () => {
  const timers = useTimerStore(state => state.timers)
  const pauseTimer = useTimerStore(state => state.pauseTimer)
  const stopTimer = useTimerStore(state => state.stopTimer)

  useEffect(() => {
    // Check if we're in Electron environment
    if (typeof window === 'undefined' || !window.electronAPI) {
      return
    }

    // Set up tray event listeners
    const handleTrayPause = () => {
      const runningTimer = timers.find(t => t.status === TimerStatus.RUNNING)
      if (runningTimer) {
        pauseTimer(runningTimer.id)
      }
    }

    const handleTrayStop = () => {
      const runningTimer = timers.find(t => t.status === TimerStatus.RUNNING)
      if (runningTimer) {
        stopTimer(runningTimer.id)
      }
    }

    window.electronAPI.onTrayPauseTimer(handleTrayPause)
    window.electronAPI.onTrayStopTimer(handleTrayStop)

    // Cleanup listeners on unmount
    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeTrayListeners()
      }
    }
  }, [timers, pauseTimer, stopTimer])

  // Function to notify Electron when timer starts
  const notifyTimerStarted = (timer: { id: string; title: string; startTime: number; totalTime: number }) => {
    if (window.electronAPI) {
      window.electronAPI.timerStarted(timer)
    }
  }

  // Function to notify Electron when timer is paused
  const notifyTimerPaused = () => {
    if (window.electronAPI) {
      window.electronAPI.timerPaused()
    }
  }

  // Function to notify Electron when timer is stopped
  const notifyTimerStopped = () => {
    if (window.electronAPI) {
      window.electronAPI.timerStopped()
    }
  }

  // Function to notify Electron when timer is reset
  const notifyTimerReset = () => {
    if (window.electronAPI) {
      window.electronAPI.timerReset()
    }
  }

  return {
    notifyTimerStarted,
    notifyTimerPaused,
    notifyTimerStopped,
    notifyTimerReset,
  }
}
