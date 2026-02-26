import { Task } from '../models/Task'

export abstract class TaskRepository {
  abstract getTasks(): Promise<Task[]>
  abstract getTaskById(id: string): Promise<Task | null>
  abstract createTask(task: Omit<Task, 'id'>): Promise<Task>
  abstract updateTask(id: string, task: Partial<Task>): Promise<Task>
  abstract deleteTask(id: string): Promise<void>
}
