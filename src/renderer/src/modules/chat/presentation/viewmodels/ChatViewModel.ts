import { makeAutoObservable, runInAction } from 'mobx'
import { ChatMessage } from '../../domain/models/ChatMessage'
import { SendMessageUseCase, GetChatHistoryUseCase } from '../../domain/usecases/ChatUseCases'

export class ChatViewModel {
  messages: ChatMessage[] = []
  loading = false
  input = ''

  constructor(
    private sendMessageUseCase: SendMessageUseCase,
    private getChatHistoryUseCase: GetChatHistoryUseCase
  ) {
    makeAutoObservable(this)
    this.loadHistory()
  }

  async loadHistory() {
    this.loading = true
    const history = await this.getChatHistoryUseCase.execute()
    runInAction(() => {
      this.messages = history
      this.loading = false
    })
  }

  setInput(value: string) {
    this.input = value
  }

  async sendMessage() {
    if (!this.input.trim()) return
    this.loading = true
    const aiMsg = await this.sendMessageUseCase.execute(this.input)
    runInAction(() => {
      this.messages.push({
        id: crypto.randomUUID(),
        role: 'user',
        content: this.input,
        createdAt: new Date()
      })
      this.messages.push(aiMsg)
      this.input = ''
      this.loading = false
    })
  }
}
