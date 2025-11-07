import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// Expose timer-specific IPC functions
contextBridge.exposeInMainWorld('electronAPI', {
  // Send timer events to main process
  timerStarted: (timerData: { id: string; title: string; startTime: number; totalTime: number }) => {
    ipcRenderer.send('timer-started', timerData)
  },
  timerPaused: () => {
    ipcRenderer.send('timer-paused')
  },
  timerStopped: () => {
    ipcRenderer.send('timer-stopped')
  },
  timerReset: () => {
    ipcRenderer.send('timer-reset')
  },
  
  // Listen for tray events
  onTrayPauseTimer: (callback: () => void) => {
    ipcRenderer.on('tray-pause-timer', callback)
  },
  onTrayStopTimer: (callback: () => void) => {
    ipcRenderer.on('tray-stop-timer', callback)
  },
  
  // Remove listeners
  removeTrayListeners: () => {
    ipcRenderer.removeAllListeners('tray-pause-timer')
    ipcRenderer.removeAllListeners('tray-stop-timer')
  }
})
