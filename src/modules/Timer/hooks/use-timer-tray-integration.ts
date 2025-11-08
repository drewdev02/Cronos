import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timer-store.ts'
import { useElectronTray } from './use-electron-tray.ts'
import { TimerStatus } from '@/types/timer.ts'

export const useTimerTrayIntegration = () => {
  const timers = useTimerStore(state => state.timers)
  const {
    notifyTimerStarted,
    notifyTimerPaused,
    notifyTimerStopped,
    notifyTimerReset
  } = useElectronTray()

  useEffect(() => {
    // Find currently running timer
    const runningTimer = timers.find(timer => timer.status === TimerStatus.RUNNING)

    if (runningTimer?.currentSessionStart) {
      // Notify Electron about the running timer
      notifyTimerStarted({
        id: runningTimer.id,
        title: runningTimer.title,
        startTime: runningTimer.currentSessionStart.getTime(),
        totalTime: runningTimer.totalTime
      })
    } else {
      // No timer running, notify Electron to clear tray
      notifyTimerStopped()
    }
  }, [timers, notifyTimerStarted, notifyTimerStopped])

  return {
    notifyTimerStarted,
    notifyTimerPaused,
    notifyTimerStopped,
    notifyTimerReset
  }
}
