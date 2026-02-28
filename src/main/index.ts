import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { runMigrations, closeDatabase } from './database'
import { registerStatisticsHandlers } from './database/ipc-handlers/statistics'
import { registerDashboardHandlers } from './database/ipc-handlers/dashboard'
import { registerTasksHandlers } from './database/ipc-handlers/tasks'
import { registerProjectsHandlers } from './database/ipc-handlers/projects'
import { registerClientsHandlers } from './database/ipc-handlers/clients'
import { registerChatHandlers } from './database/ipc-handlers/chat'

let tray: Tray | null = null

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Initialize database and run migrations
  runMigrations()
  registerClientsHandlers()
  registerProjectsHandlers()
  registerTasksHandlers()
  registerDashboardHandlers()
  registerStatisticsHandlers()
  registerChatHandlers()

  createWindow()

  // Initialize tray
  const appIcon = nativeImage.createFromPath(icon)
  const trayIcon = appIcon.resize({ width: 16, height: 16 })
  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar Cronos',
      click: () => {
        const windows = BrowserWindow.getAllWindows()
        if (windows.length === 0) {
          createWindow()
        } else {
          windows[0].show()
        }
      }
    },
    { type: 'separator' },
    { label: 'Salir', role: 'quit' }
  ])

  tray.setContextMenu(contextMenu)
  tray.setTitle('')

  ipcMain.on('tray:update', (_, text) => {
    if (tray) {
      // Set the title on macOS menu bar
      tray.setTitle(text)
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  closeDatabase()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
