export interface Project {
  id: string
  name: string
  // Optional client relation populated from the DB
  client?: {
    id: string
    name: string
  }
  color?: string
  rate?: number
}
