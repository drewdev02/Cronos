import { ChatMessage } from '../../domain/models/ChatMessage'

export interface MessageDTO {
  id: string
  content: string
  sender: 'user' | 'ia'
  createdAt: string
}

export class MessageMapper {
  static toDomain(dto: MessageDTO): ChatMessage {
    return {
      id: dto.id,
      role: dto.sender === 'user' ? 'user' : 'assistant',
      content: dto.content,
      createdAt: new Date(dto.createdAt)
    }
  }
  static toDTO(domain: ChatMessage): MessageDTO {
    return {
      id: domain.id,
      content: domain.content,
      sender: domain.role === 'user' ? 'user' : 'ia',
      createdAt: domain.createdAt.toISOString()
    }
  }
}
