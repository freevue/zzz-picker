import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useNavigation, useSubmit } from '@remix-run/react'
import { chatWithGemini } from '@zzz-picker/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef } from 'react'
import { z } from 'zod'

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

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'model'; text: string; isLoading?: boolean }[]
  >([])
  const [input, setInput] = useState('')
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const scrollRef = useRef<HTMLDivElement>(null)

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    if (actionData && 'response' in actionData) {
      setMessages((prev) => {
        // 마지막 메시지가 로딩 중인 모델 메시지라면 교체
        const newMessages = [...prev]
        const lastMsg = newMessages[newMessages.length - 1]

        if (lastMsg && lastMsg.role === 'model' && lastMsg.isLoading) {
          // 로딩 메시지를 실제 응답으로 교체
          newMessages[newMessages.length - 1] = { role: 'model', text: actionData.response }
          // 그 이전이 유저 메시지일 텐데, 이는 그대로 둠 (Optimistic 값이 맞다고 가정)
          return newMessages
        }

        // 만약 로딩 메시지가 없다면(새로고침 등), 그냥 추가
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
  }, [messages]) // isSubmitting 의존성 제거 (메시지 상태로 제어)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    const currentInput = input
    setInput('') // 즉시 초기화

    // Optimistic Update: 유저 메시지와 로딩 중인 모델 메시지 즉시 추가
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
    // 로딩 메시지는 제외하고 전송 (마지막 꺼는 아직 추가 안된 상태인 이전 messages 기준이므로 안전하지만,
    // setMessages는 비동기라 messages가 아직 안바뀌었을 수 있음.
    // 하지만 안전하게 historyForApi는 클로저의 stale state를 쓸 수도 있으니 주의.
    // 기존 messages에는 아직 currentInput과 loading이 없으므로 historyForApi는 '이전' 히스토리임. 이게 맞음.
    formData.append('history', JSON.stringify(historyForApi))

    submit(formData, { method: 'post' })
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[var(--charade-950)] text-[var(--charade-100)]">
      {/* Header */}
      <header className="flex h-16 items-center border-b border-[var(--charade-50)]/10 bg-[var(--charade-950)]/20 px-6 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-[var(--charade-50)]">ZZZ Assistant</h1>
        <div className="ml-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
          </span>
          <span className="text-xs text-[var(--charade-300)] uppercase tracking-widest">
            Gemini 2.5 Flash
          </span>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-[var(--charade-50)]/10"
      >
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center text-center opacity-40"
            >
              <div className="mb-4 text-4xl">🤖</div>
              <p className="text-lg">무엇을 도와드릴까요?</p>
              <p className="text-sm mt-1 italic">Supabase의 실시간 데이터를 기반으로 답변합니다.</p>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-secondary to-tertiary text-[var(--charade-50)]'
                    : 'bg-[var(--charade-50)]/5 border border-[var(--charade-50)]/10 text-[var(--charade-200)]'
                }`}
              >
                {msg.isLoading ? (
                  <div className="flex gap-1.5 items-center h-6">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--charade-300)] [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--charade-300)] [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--charade-300)]"></span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-[0.95rem]">{msg.text}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <footer className="p-4 md:p-8 bg-gradient-to-t from-[var(--charade-950)] to-transparent">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            placeholder="메시지를 입력하세요..."
            className="w-full rounded-2xl border border-[var(--charade-50)]/10 bg-[var(--charade-50)]/5 py-4 pl-5 pr-16 text-[var(--charade-50)] placeholder:text-[var(--charade-400)] focus:border-secondary/50 focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all backdrop-blur-xl"
          />
          <button
            type="submit"
            disabled={isSubmitting || !input.trim()}
            className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-secondary text-[var(--charade-50)] shadow-lg shadow-secondary/20 transition-all hover:brightness-110 disabled:opacity-50 disabled:hover:bg-secondary flex items-center justify-center group"
          >
            <svg
              className={`h-5 w-5 transform transition-transform ${isSubmitting ? 'scale-0' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  )
}

export default Chat
