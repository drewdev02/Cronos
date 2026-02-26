import { Task } from '../models/Task'
import { TrayRepository } from '../repositories/TrayRepository'

export class StartTaskTimerUseCase {
  constructor(private readonly trayRepository: TrayRepository) {}

  execute(getTasks: () => Task[], onTick: (updatedTasks: Task[]) => void): NodeJS.Timeout {
    return setInterval(() => {
      let activeTaskName = ''
      let activeDuration = 0

      const currentTasks = getTasks()
      const updatedTasks = currentTasks.map((t) => {
        if (t.status === 'in_progress' && t.startTime) {
          const now = new Date()
          const elapsed = Math.floor((now.getTime() - t.startTime.getTime()) / 1000)
          const currentDuration = t.duration + Math.max(0, elapsed)

          activeTaskName = t.title
          activeDuration = currentDuration

          return { ...t, currentDuration }
        }
        return t
      })

      if (activeTaskName) {
        const hours = Math.floor(activeDuration / 3600)
        const minutes = Math.floor((activeDuration % 3600) / 60)
        const seconds = activeDuration % 60
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        this.trayRepository.updateTitle(`${activeTaskName} - ${timeString}`)
      } else {
        this.trayRepository.updateTitle('')
      }

      onTick(updatedTasks)
    }, 1000)
  }
}
