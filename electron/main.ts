import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null = null
let isQuitting = false

interface RunningTimer {
  id: string
  title: string
  startTime: number
  totalTime: number
}

let currentRunningTimer: RunningTimer | null = null

// IPC Handlers for timer communication
function setupIPC() {
  // Handle timer start/update from renderer
  ipcMain.on('timer-started', (_, timerData: { id: string; title: string; startTime: number; totalTime: number }) => {
    currentRunningTimer = {
      id: timerData.id,
      title: timerData.title,
      startTime: timerData.startTime,
      totalTime: timerData.totalTime
    }
    
    updateTrayMenu(true)
    
    // Update tray title immediately with current time
    const currentTime = Date.now()
    const sessionTime = currentTime - timerData.startTime
    const totalTime = timerData.totalTime + sessionTime
    const formattedTime = formatDuration(totalTime)
    const title = `${timerData.title} - ${formattedTime}`
    updateTrayTitle(title)
    
    // Start interval only if not already running
    if (!trayUpdateInterval) {
      startTrayUpdateInterval()
    }
  })
  
  // Handle timer paused from renderer
  ipcMain.on('timer-paused', () => {
    currentRunningTimer = null
    updateTrayTitle('Cronos')
    updateTrayMenu(false)
    stopTrayUpdateInterval()
  })
  
  // Handle timer stopped from renderer
  ipcMain.on('timer-stopped', () => {
    currentRunningTimer = null
    updateTrayTitle('Cronos')
    updateTrayMenu(false)
    stopTrayUpdateInterval()
  })
  
  // Handle timer reset from renderer
  ipcMain.on('timer-reset', () => {
    currentRunningTimer = null
    updateTrayTitle('Cronos')
    updateTrayMenu(false)
    stopTrayUpdateInterval()
  })
}

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function createTray() {
  // Create a simple icon for the tray (a clock symbol)
  const trayIcon = nativeImage.createFromNamedImage('NSImageNameStopwatch', [16, 16])
  
  tray = new Tray(trayIcon)
  tray.setToolTip('Cronos - Timer App')
  
  updateTrayTitle('Cronos')
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar aplicación',
      click: () => {
        if (win) {
          win.show()
          win.focus()
        } else {
          createWindow()
        }
      }
    },
    {
      label: 'Pausar timer activo',
      id: 'pause-timer',
      enabled: false,
      click: () => {
        win?.webContents.send('tray-pause-timer')
      }
    },
    {
      label: 'Detener timer activo', 
      id: 'stop-timer',
      enabled: false,
      click: () => {
        win?.webContents.send('tray-stop-timer')
      }
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])
  
  tray.setContextMenu(contextMenu)
  
  // Click on tray icon to show/hide window
  tray.on('click', () => {
    if (win) {
      if (win.isVisible()) {
        win.hide()
      } else {
        win.show()
        win.focus()
      }
    } else {
      createWindow()
    }
  })
}

function updateTrayTitle(title: string = 'Cronos') {
  if (tray) {
    tray.setTitle(title)
  }
}

function updateTrayMenu(hasRunningTimer: boolean) {
  if (!tray) return
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar aplicación',
      click: () => {
        if (win) {
          win.show()
          win.focus()
        } else {
          createWindow()
        }
      }
    },
    {
      label: 'Pausar timer activo',
      id: 'pause-timer',
      enabled: hasRunningTimer,
      click: () => {
        win?.webContents.send('tray-pause-timer')
      }
    },
    {
      label: 'Detener timer activo',
      id: 'stop-timer', 
      enabled: hasRunningTimer,
      click: () => {
        win?.webContents.send('tray-stop-timer')
      }
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])
  
  tray.setContextMenu(contextMenu)
}

// Timer update interval
let trayUpdateInterval: NodeJS.Timeout | null = null

function startTrayUpdateInterval() {
  if (trayUpdateInterval) {
    clearInterval(trayUpdateInterval)
  }
  
  trayUpdateInterval = setInterval(() => {
    if (currentRunningTimer) {
      const currentTime = Date.now()
      const sessionTime = currentTime - currentRunningTimer.startTime
      const totalTime = currentRunningTimer.totalTime + sessionTime
      
      const formattedTime = formatDuration(totalTime)
      const title = `${currentRunningTimer.title} - ${formattedTime}`
      updateTrayTitle(title)
    }
  }, 1000)
}

function stopTrayUpdateInterval() {
  if (trayUpdateInterval) {
    clearInterval(trayUpdateInterval)
    trayUpdateInterval = null
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  })

  // Prevent window close, hide instead (for tray functionality)
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      win?.hide()
      return false
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Add error handling
  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL)
  })

  // Open DevTools in development
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    isQuitting = true
    app.quit()
    win = null
  }
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()
  createTray()
  setupIPC()
})
