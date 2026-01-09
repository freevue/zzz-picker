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
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([])
  const [input, setInput] = useState('')
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const scrollRef = useRef<HTMLDivElement>(null)

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    if (actionData && 'response' in actionData) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: actionData.userMessage.parts[0].text },
        { role: 'model', text: actionData.response },
      ])
    }
  }, [actionData])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isSubmitting])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    const historyForApi = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }))

    const formData = new FormData()
    formData.append('message', input)
    formData.append('history', JSON.stringify(historyForApi))

    submit(formData, { method: 'post' })
    setInput('')
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#0a0a0a] text-slate-200">
      {/* Header */}
      <header className="flex h-16 items-center border-b border-white/10 bg-black/20 px-6 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-white">ZZZ Assistant</h1>
        <div className="ml-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-widest">Gemini 2.5 Flash</span>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/10"
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
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-100'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-[0.95rem]">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 flex gap-1.5 items-center">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <footer className="p-4 md:p-8 bg-gradient-to-t from-black to-transparent">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting}
            placeholder="메시지를 입력하세요..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-5 pr-16 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all backdrop-blur-xl"
          />
          <button
            type="submit"
            disabled={isSubmitting || !input.trim()}
            className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center group"
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
