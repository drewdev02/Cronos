"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Send timer events to main process
  timerStarted: (timerData) => {
    electron.ipcRenderer.send("timer-started", timerData);
  },
  timerPaused: () => {
    electron.ipcRenderer.send("timer-paused");
  },
  timerStopped: () => {
    electron.ipcRenderer.send("timer-stopped");
  },
  timerReset: () => {
    electron.ipcRenderer.send("timer-reset");
  },
  // Listen for tray events
  onTrayPauseTimer: (callback) => {
    electron.ipcRenderer.on("tray-pause-timer", callback);
  },
  onTrayStopTimer: (callback) => {
    electron.ipcRenderer.on("tray-stop-timer", callback);
  },
  // Remove listeners
  removeTrayListeners: () => {
    electron.ipcRenderer.removeAllListeners("tray-pause-timer");
    electron.ipcRenderer.removeAllListeners("tray-stop-timer");
  }
});
