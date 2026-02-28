import { ChatMessage } from '../models/ChatMessage'
import { ChatRepository } from '../repositories/ChatRepository'

export class SendMessageUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(message: string): Promise<ChatMessage> {
    return this.chatRepository.sendMessage(message)
  }
}

export class GetChatHistoryUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(): Promise<ChatMessage[]> {
    return this.chatRepository.getHistory()
  }
}
