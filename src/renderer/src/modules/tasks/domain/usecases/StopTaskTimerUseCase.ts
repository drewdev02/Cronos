import { TrayRepository } from '../repositories/TrayRepository'

export class StopTaskTimerUseCase {
  constructor(private readonly trayRepository: TrayRepository) {}

  execute(timerId: NodeJS.Timeout): void {
    clearInterval(timerId)
    this.trayRepository.updateTitle('')
  }
}
