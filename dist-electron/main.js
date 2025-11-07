import { app, BrowserWindow, nativeImage, Tray, Menu, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let tray = null;
let isQuitting = false;
let currentRunningTimer = null;
function setupIPC() {
  ipcMain.on("timer-started", (_, timerData) => {
    currentRunningTimer = {
      id: timerData.id,
      title: timerData.title,
      startTime: timerData.startTime,
      totalTime: timerData.totalTime
    };
    updateTrayMenu(true);
    const currentTime = Date.now();
    const sessionTime = currentTime - timerData.startTime;
    const totalTime = timerData.totalTime + sessionTime;
    const formattedTime = formatDuration(totalTime);
    const title = `${timerData.title} - ${formattedTime}`;
    updateTrayTitle(title);
    if (!trayUpdateInterval) {
      startTrayUpdateInterval();
    }
  });
  ipcMain.on("timer-paused", () => {
    currentRunningTimer = null;
    updateTrayTitle("Cronos");
    updateTrayMenu(false);
    stopTrayUpdateInterval();
  });
  ipcMain.on("timer-stopped", () => {
    currentRunningTimer = null;
    updateTrayTitle("Cronos");
    updateTrayMenu(false);
    stopTrayUpdateInterval();
  });
  ipcMain.on("timer-reset", () => {
    currentRunningTimer = null;
    updateTrayTitle("Cronos");
    updateTrayMenu(false);
    stopTrayUpdateInterval();
  });
}
function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1e3);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
function createTray() {
  const trayIcon = nativeImage.createFromNamedImage("NSImageNameStopwatch", [16, 16]);
  tray = new Tray(trayIcon);
  tray.setToolTip("Cronos - Timer App");
  updateTrayTitle("Cronos");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mostrar aplicación",
      click: () => {
        if (win) {
          win.show();
          win.focus();
        } else {
          createWindow();
        }
      }
    },
    {
      label: "Pausar timer activo",
      id: "pause-timer",
      enabled: false,
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-pause-timer");
      }
    },
    {
      label: "Detener timer activo",
      id: "stop-timer",
      enabled: false,
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-stop-timer");
      }
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (win) {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    } else {
      createWindow();
    }
  });
}
function updateTrayTitle(title = "Cronos") {
  if (tray) {
    tray.setTitle(title);
  }
}
function updateTrayMenu(hasRunningTimer) {
  if (!tray) return;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mostrar aplicación",
      click: () => {
        if (win) {
          win.show();
          win.focus();
        } else {
          createWindow();
        }
      }
    },
    {
      label: "Pausar timer activo",
      id: "pause-timer",
      enabled: hasRunningTimer,
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-pause-timer");
      }
    },
    {
      label: "Detener timer activo",
      id: "stop-timer",
      enabled: hasRunningTimer,
      click: () => {
        win == null ? void 0 : win.webContents.send("tray-stop-timer");
      }
    },
    { type: "separator" },
    {
      label: "Salir",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
}
let trayUpdateInterval = null;
function startTrayUpdateInterval() {
  if (trayUpdateInterval) {
    clearInterval(trayUpdateInterval);
  }
  trayUpdateInterval = setInterval(() => {
    if (currentRunningTimer) {
      const currentTime = Date.now();
      const sessionTime = currentTime - currentRunningTimer.startTime;
      const totalTime = currentRunningTimer.totalTime + sessionTime;
      const formattedTime = formatDuration(totalTime);
      const title = `${currentRunningTimer.title} - ${formattedTime}`;
      updateTrayTitle(title);
    }
  }, 1e3);
}
function stopTrayUpdateInterval() {
  if (trayUpdateInterval) {
    clearInterval(trayUpdateInterval);
    trayUpdateInterval = null;
  }
}
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });
  win.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win == null ? void 0 : win.hide();
      return false;
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    console.error("Failed to load:", errorCode, errorDescription, validatedURL);
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    isQuitting = true;
    app.quit();
    win = null;
  }
});
app.on("before-quit", () => {
  isQuitting = true;
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  createTray();
  setupIPC();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
