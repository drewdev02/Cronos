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

// Timer state for menu bar
interface TimerState {
  isRunning: boolean
  taskName: string
  elapsedTime: string
  status: 'stopped' | 'running' | 'paused'
}

let timerState: TimerState = { 
  isRunning: false, 
  taskName: '', 
  elapsedTime: '00:00:00',
  status: 'stopped'
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
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow();
  createTray();
})

function createTray() {
  tray = new Tray(nativeImage.createEmpty()); // You can set a custom icon here
  updateTrayMenu();
}

function updateTrayMenu() {
  let label = 'Cronos';
  if (timerState.isRunning) {
    label = `${timerState.elapsedTime} - ${timerState.taskName}`;
  } else if (timerState.status === 'paused') {
    label = `⏸ ${timerState.elapsedTime} - ${timerState.taskName}`;
  }
  tray?.setTitle(label); // macOS only
  tray?.setToolTip('Cronos Timer');
  tray?.setContextMenu(Menu.buildFromTemplate([
    { label: label, enabled: false },
    { type: 'separator' },
    { label: 'Abrir Cronos', click: () => win?.show() },
    { label: 'Salir', click: () => app.quit() }
  ]));
}

// IPC handler to receive timer updates from renderer
ipcMain.on('timer-update', (_event, state) => {
  timerState = state;
  updateTrayMenu();
});
