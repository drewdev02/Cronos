import { Client } from '../models/Client'

export abstract class ClientRepository {
  abstract getClients(): Promise<Client[]>
}
