import { TrayRepository } from '../../domain/repositories/TrayRepository'

export class TrayRepositoryImpl extends TrayRepository {
  updateTitle(title: string): void {
    window.electron?.ipcRenderer.send('tray:update', title)
  }
}
