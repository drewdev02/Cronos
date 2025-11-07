export interface ElectronAPI {
  timerStarted: (timerData: { id: string; title: string; startTime: number; totalTime: number }) => void
  timerPaused: () => void
  timerStopped: () => void
  timerReset: () => void
  onTrayPauseTimer: (callback: () => void) => void
  onTrayStopTimer: (callback: () => void) => void
  removeTrayListeners: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}