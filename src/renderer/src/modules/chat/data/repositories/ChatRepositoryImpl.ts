import { ChatRepository } from '../../domain/repositories/ChatRepository'
import { ChatMessage } from '../../domain/models/ChatMessage'

import { MessageMapper, MessageDTO } from '../mappers/MessageMapper'

export class ChatRepositoryImpl implements ChatRepository {
  async sendMessage(message: string): Promise<ChatMessage> {
    console.log('sendMessage:', message)
    
    try {
      const { ia } = await window.api.chat.sendMessage(message)
      return {
        id: ia.id,
        role: 'assistant',
        content: ia.content,
        createdAt: new Date(ia.createdAt)
      }
    } catch (error) {
      throw new Error(`Error sending message: ${error}`)
    }
  }

  async getHistory(): Promise<ChatMessage[]> {
    const rows: MessageDTO[] = await window.api.messages.getAll()
    return rows.map(MessageMapper.toDomain)
  }
}
