import { ChatMessage } from '../models/ChatMessage'

export abstract class ChatRepository {
  abstract sendMessage(message: string): Promise<ChatMessage>
  abstract getHistory(): Promise<ChatMessage[]>
}
