import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Database API for renderer
const databaseAPI = {
  clients: {
    getAll: () => ipcRenderer.invoke('db:clients:getAll'),
    getLite: () => ipcRenderer.invoke('db:clients:getLite'),
    getById: (id: string) => ipcRenderer.invoke('db:clients:getById', id),
    create: (data: Record<string, unknown>) => ipcRenderer.invoke('db:clients:create', data),
    update: (id: string, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db:clients:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('db:clients:delete', id)
  },
  projects: {
    getAll: () => ipcRenderer.invoke('db:projects:getAll'),
    getById: (id: string) => ipcRenderer.invoke('db:projects:getById', id),
    create: (data: Record<string, unknown>) => ipcRenderer.invoke('db:projects:create', data),
    update: (id: string, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db:projects:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('db:projects:delete', id)
  },
  tasks: {
    getAll: () => ipcRenderer.invoke('db:tasks:getAll'),
    getById: (id: string) => ipcRenderer.invoke('db:tasks:getById', id),
    create: (data: Record<string, unknown>) => ipcRenderer.invoke('db:tasks:create', data),
    update: (id: string, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db:tasks:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('db:tasks:delete', id)
  },
  dashboard: {
    getStats: () => ipcRenderer.invoke('db:dashboard:getStats')
  },
  statistics: {
    getStats: () => ipcRenderer.invoke('db:statistics:getStats')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', databaseAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = databaseAPI
}
