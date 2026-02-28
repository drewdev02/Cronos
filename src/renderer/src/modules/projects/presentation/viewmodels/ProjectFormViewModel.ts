import { makeAutoObservable } from 'mobx'
import { Project } from '../../domain/models/Project'

export interface ProjectFormClientOption {
  id: string
  name: string
}

export class ProjectFormViewModel {
  name = ''
  clientId = ''
  rate = ''
  color = ''
  initial: Partial<Project> = {}
  clients: ProjectFormClientOption[] = []

  constructor(initial: Partial<Project> = {}, clients: ProjectFormClientOption[] = []) {
    makeAutoObservable(this)
    this.setInitial(initial, clients)
  }

  setInitial(initial: Partial<Project>, clients: ProjectFormClientOption[]) {
    this.initial = initial
    this.clients = clients
    this.name = initial.name ?? ''
    this.clientId = initial.client?.id ?? ''
    this.rate = initial.rate !== undefined ? String(initial.rate) : ''
    this.color = initial.color ?? ''
  }

  setName(name: string) {
    this.name = name
  }

  setClientId(clientId: string) {
    this.clientId = clientId
  }

  setRate(rate: string) {
    this.rate = rate
  }

  setColor(color: string) {
    this.color = color
  }

  get project(): Project {
    const selectedClient = this.clients.find((c) => c.id === this.clientId)
    return {
      id: this.initial.id ?? `${Date.now()}`,
      name: this.name.trim() || 'Untitled',
      client: selectedClient ? { id: selectedClient.id, name: selectedClient.name } : undefined,
      color: this.color || undefined,
      rate: this.rate ? Number(this.rate) : undefined
    }
  }
}
