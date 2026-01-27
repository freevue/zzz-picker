import { pipe, concat, join } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { motion } from 'motion/react'

const MODEL_PROFILE_URL =
  'https://images.zzz.freevue.dev/images/agents/156728/8bbef43670d3f27df029bcb3fff252f3_4423906655536049482.webp'

interface Props {
  role: 'user' | 'model'
  text: string
  isLoading?: boolean
  idx: number
}

export const MessageItem: React.FC<Props> = ({ role, text, isLoading, idx }) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, x: role === 'user' ? 20 : -20, y: 10 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    className={pipe(
      ['flex', 'gap-4', 'items-start'],
      concat(role === 'user' ? ['flex-row-reverse'] : ['flex-row']),
      join(' ')
    )}
  >
    {role === 'model' && (
      <div className="size-10 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 mt-1">
        <img src={MODEL_PROFILE_URL} alt="Model Profile" className="size-full object-cover" />
      </div>
    )}
    <div
      className={pipe(
        ['max-w-[85%]', 'p-6', 'shadow-2xl', 'backdrop-blur-md'],
        concat(
          role === 'user'
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
      {isLoading ? (
        <div className="flex gap-2 items-center h-8 px-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30 [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink/30"></span>
        </div>
      ) : (
        <Typo.Body
          className={pipe(
            ['text-xl', 'leading-relaxed'],
            concat(role === 'user' ? ['text-white font-bold'] : ['text-ink font-medium']),
            join(' ')
          )}
        >
          {text}
        </Typo.Body>
      )}
    </div>
  </motion.div>
)
