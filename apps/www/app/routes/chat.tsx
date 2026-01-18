import { pipe, concat, join } from '@fxts/core'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useNavigation, useSubmit } from '@remix-run/react'
import { Form, Typo } from '@zzz-picker/components/v2'
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
  const isSubmitting = navigation.state === 'submitting'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const MODEL_PROFILE_URL =
    'https://images.zzz.freevue.dev/images/agents/156728/8bbef43670d3f27df029bcb3fff252f3_4423906655536049482.webp'

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
    <div className="flex h-screen w-full flex-col bg-content text-ink">
      {/* Header */}
      <header className="flex h-20 items-center border-b border-white/10 bg-content/20 px-6 backdrop-blur-md">
        <Typo.Heading className="text-2xl font-black tracking-tight text-ink">
          ZZZ Assistant
        </Typo.Heading>
        <div className="ml-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary"></span>
          </span>
          <Typo.Body className="text-sm text-ink/50 uppercase tracking-widest font-black">
            Gemini 2.5 Flash
          </Typo.Body>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hidden"
      >
        <div className="mx-auto max-w-3xl w-full p-4 md:px-0 md:py-8 space-y-8">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center text-center opacity-40 py-20"
              >
                <div className="size-32 rounded-3xl overflow-hidden bg-white/5 mb-6 border border-white/10">
                  <img
                    src={MODEL_PROFILE_URL}
                    alt="Model Profile"
                    className="size-full object-cover"
                  />
                </div>
                <Typo.Heading className="text-2xl font-black mb-2">
                  무엇을 도와드릴까요?
                </Typo.Heading>
                <Typo.Body className="text-lg italic opacity-70">
                  강습전의 실시간 데이터를 기반으로 답변합니다.
                </Typo.Body>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                className={pipe(
                  ['flex', 'gap-4', 'items-start'],
                  concat(msg.role === 'user' ? ['flex-row-reverse'] : ['flex-row']),
                  join(' ')
                )}
              >
                {msg.role === 'model' && (
                  <div className="size-10 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 mt-1">
                    <img
                      src={MODEL_PROFILE_URL}
                      alt="Model Profile"
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={pipe(
                    ['max-w-[85%]', 'p-6', 'shadow-2xl', 'backdrop-blur-md'],
                    concat(
                      msg.role === 'user'
                        ? ['bg-secondary', 'text-white', 'rounded-3xl', 'rounded-tr-none']
                        : [
                            'bg-white/5',
                            'text-ink',
                            'rounded-3xl',
                            'rounded-tl-none',
                            'border',
                            'border-white/10',
                          ]
                    ),
                    join(' ')
                  )}
                >
                  {msg.isLoading ? (
                    <div className="flex gap-2 items-center h-8 px-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30"></span>
                    </div>
                  ) : (
                    <Typo.Body
                      className={pipe(
                        ['text-xl', 'leading-relaxed'],
                        concat(
                          msg.role === 'user' ? ['text-white font-bold'] : ['text-ink font-medium']
                        ),
                        join(' ')
                      )}
                    >
                      {msg.text}
                    </Typo.Body>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <footer className="p-4 md:p-10 bg-gradient-to-t from-content to-transparent">
        <Form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl relative flex items-center gap-4"
        >
          <div className="relative flex-1 group">
            <Form.Input
              type="text"
              name="message"
              value={input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className={pipe(
                [
                  'w-full',
                  'h-16',
                  'rounded-2xl',
                  'border-2',
                  'text-xl',
                  'font-medium',
                  'transition-all',
                  'duration-300',
                ],
                concat(
                  isFocused || input.trim()
                    ? ['bg-primary', 'text-black', 'border-primary', 'placeholder:text-black/40']
                    : [
                        'bg-secondary/20',
                        'text-ink',
                        'border-secondary/30',
                        'placeholder:text-ink/30',
                      ]
                ),
                join(' ')
              )}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !input.trim()}
            className={pipe(
              [
                'flex-shrink-0',
                'size-16',
                'rounded-2xl',
                'text-white',
                'shadow-2xl',
                'transition-all',
                'duration-300',
                'hover:scale-105',
                'active:scale-95',
                'disabled:opacity-20',
                'disabled:grayscale',
                'flex',
                'items-center',
                'justify-center',
                'overflow-hidden',
              ],
              concat(
                isFocused || input.trim()
                  ? ['bg-primary', 'text-black', 'shadow-primary/30']
                  : ['bg-secondary', 'text-white', 'shadow-secondary/30']
              ),
              join(' ')
            )}
          >
            {isSubmitting ? (
              <span className="size-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
            ) : (
              <svg
                className="h-6 w-6 transform -rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </Form>
      </footer>
    </div>
  )
}

export default Chat
