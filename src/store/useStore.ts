import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Client, Project, Task, TimeEntry, Invoice } from '../types'

type State = {
  clients: Client[]
  projects: Project[]
  tasks: Task[]
  timeEntries: TimeEntry[]
  invoices: Invoice[]
  // actions
  addClient: (c: Omit<Client, 'id' | 'createdAt'>) => Client
  updateClient: (id: string, patch: Partial<Client>) => Client | undefined
  removeClient: (id: string) => void
}

export const useStore = create<State>()(
  devtools((set, get) => ({
    clients: [],
    projects: [],
    tasks: [],
    timeEntries: [],
    invoices: [],
    addClient: (c) => {
      const client: Client = { ...c, id: uuidv4(), createdAt: new Date().toISOString() }
      set((s) => ({ clients: [...s.clients, client] }))
      return client
    },
    updateClient: (id, patch) => {
      let updated: Client | undefined
      set((s) => ({
        clients: s.clients.map((cl) => {
          if (cl.id === id) {
            updated = { ...cl, ...patch }
            return updated
          }
          return cl
        }),
      }))
      return updated
    },
    removeClient: (id) => {
      // remove client and associated projects, tasks, invoices
      set((s) => ({
        clients: s.clients.filter((c) => c.id !== id),
        projects: s.projects.filter((p) => p.clientId !== id),
        tasks: s.tasks.filter((t) => {
          const project = s.projects.find((p) => p.id === t.projectId)
          return project ? project.clientId !== id : true
        }),
        invoices: s.invoices.filter((inv) => inv.clientId !== id),
      }))
    },
  })),
)

export default useStore
