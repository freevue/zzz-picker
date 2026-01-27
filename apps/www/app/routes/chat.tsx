import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useNavigation, useSubmit } from '@remix-run/react'
import { chatWithGemini } from '@zzz-picker/supabase'
import { AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef } from 'react'
import { z } from 'zod'
import { ChatHeader, EmptyState, MessageItem, ChatInput } from '~/components/Chat'

const chatSchema = z.object({
  message: z.string().min(1, '메시지를 입력해주세요.'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      parts: z.array(z.object({ text: z.string() })),
    })
  ),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const message = formData.get('message')
  const historyRaw = formData.get('history')

  const result = chatSchema.safeParse({
    message,
    history: historyRaw ? JSON.parse(historyRaw as string) : [],
  })

  if (!result.success) {
    return json({ error: '잘못된 요청 형식입니다. 데이터를 확인해주세요.' }, { status: 400 })
  }

  const { message: validatedMessage, history } = result.data
  const userMessage = { role: 'user', parts: [{ text: validatedMessage }] }
  const newHistory = [...history, userMessage] as any[]

  try {
    const response = await chatWithGemini(newHistory)
    return json({ response, userMessage })
  } catch (error: any) {
    console.error('--- Chat Action Error ---')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    console.error('--------------------------')
    return json({ error: 'AI 응답 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'model'; text: string; isLoading?: boolean }[]
  >([])
  const [input, setInput] = useState('')
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === 'submitting'
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (actionData && 'response' in actionData) {
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]

        if (lastMsg && lastMsg.role === 'model' && lastMsg.isLoading) {
          newMessages[newMessages.length - 1] = { role: 'model', text: actionData.response }
          return newMessages
        }

        return [
          ...prev,
          { role: 'user', text: actionData.userMessage.parts[0].text },
          { role: 'model', text: actionData.response },
        ]
      })
    }
  }, [actionData])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    const currentInput = input
    setInput('')

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: currentInput },
      { role: 'model', text: '', isLoading: true },
    ])

    const historyForApi = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }))

    const formData = new FormData()
    formData.append('message', currentInput)
    formData.append('history', JSON.stringify(historyForApi))

    submit(formData, { method: 'post' })
  }

  return (
    <div className="flex h-screen w-full flex-col bg-content text-ink">
      <ChatHeader />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hidden"
      >
        <div className="mx-auto max-w-3xl w-full p-4 md:px-0 md:py-8 space-y-8">
          <AnimatePresence>
            {messages.length === 0 && <EmptyState />}
            {messages.map((msg, idx) => (
              <MessageItem key={idx} {...msg} idx={idx} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default Chat
