import { Client } from '../models/Client'

export abstract class ClientRepository {
  abstract getClients(): Promise<Client[]>
  abstract createClient(client: Client): Promise<Client>
  abstract getClientById(id: string): Promise<Client | null>
  abstract updateClient(id: string, data: Partial<Client>): Promise<Client | null>
}
