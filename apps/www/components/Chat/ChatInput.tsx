import { pipe, concat, join } from '@fxts/core'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

interface Props {
  input: string
  setInput: (val: string) => void
  isSubmitting: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export const ChatInput: React.FC<Props> = ({ input, setInput, isSubmitting, handleSubmit }) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <footer className="p-4 md:p-10 bg-gradient-to-t from-content to-transparent">
      <Form onSubmit={handleSubmit} className="mx-auto max-w-3xl relative flex items-center gap-4">
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
  )
}
