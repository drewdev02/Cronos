import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogle } from '@langchain/google'
import { createAgent } from 'langchain'

import { getDatabase } from '../index'
import { messages } from '../schema'
import { randomUUID } from 'crypto'
import { ipcMain } from 'electron'

export function registerChatHandlers(): void {
  const db = getDatabase()

  ipcMain.handle('db:messages:getAll', async () => {
    return db.select().from(messages).all()
  })

  ipcMain.handle('db:messages:create', async (_event, { content, sender }) => {
    const id = randomUUID()
    const createdAt = new Date().toISOString()
    db.insert(messages).values({ id, content, sender, createdAt }).run()
    return { id, content, sender, createdAt }
  })

  ipcMain.handle('db:chat:sendMessage', async (_event, { content }) => {
    console.log('Received message:', content)

    // Guarda mensaje del usuario
    const userId = randomUUID()
    const userCreatedAt = new Date().toISOString()
    db.insert(messages)
      .values({ id: userId, content, sender: 'user', createdAt: userCreatedAt })
      .run()
    console.log('asdasd')

    // Procesa con LangChain (Node only)
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    const model = new ChatOpenAI({
      model: 'gpt-4.1',
      temperature: 0.1,
      maxTokens: 1000,
      timeout: 30,
      apiKey
    })
    const agent = createAgent({ model, tools: [] })
    const aiResponse = await agent.invoke({ messages: [{ role: 'human', content }] })
    let aiContent = aiResponse?.messages?.at(-1)?.content ?? 'Sin respuesta'
    if (Array.isArray(aiContent)) {
      aiContent = aiContent
        .map((part) => (typeof part === 'string' ? part : (part?.text ?? '')))
        .join(' ')
    } else if (typeof aiContent !== 'string') {
      aiContent = String(aiContent)
    }

    console.log('AI Response:', aiContent)

    // Guarda respuesta IA
    const iaId = randomUUID()
    const iaCreatedAt = new Date().toISOString()
    db.insert(messages)
      .values({ id: iaId, content: aiContent, sender: 'ia', createdAt: iaCreatedAt })
      .run()

    return {
      user: { id: userId, content, sender: 'user', createdAt: userCreatedAt },
      ia: { id: iaId, content: aiContent, sender: 'ia', createdAt: iaCreatedAt }
    }
  })
}
