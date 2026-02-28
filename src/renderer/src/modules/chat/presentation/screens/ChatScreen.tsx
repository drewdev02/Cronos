import { observer } from 'mobx-react-lite'
import { ChatViewModel } from '../viewmodels/ChatViewModel'
import { useInjection } from '@/shared/hooks/useInjection'
import { useRef, useEffect } from 'react'

export const ChatScreen = observer(() => {
  const vm = useInjection(ChatViewModel)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [vm.messages.length])

  return (
    <div className="flex flex-col h-full max-h-150 w-full bg-background rounded-lg border p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {vm.messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground self-end ml-auto' : 'bg-muted text-muted-foreground self-start mr-auto'}`}
          >
            <span>{msg.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          vm.sendMessage()
        }}
      >
        <input
          className="flex-1 border rounded px-3 py-2 bg-background"
          value={vm.input}
          onChange={(e) => vm.setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={vm.loading}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
          disabled={vm.loading || !vm.input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  )
})
