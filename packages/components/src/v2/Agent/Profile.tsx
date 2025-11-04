import { useRoundedSize } from '..'
import { pipe, concat, join } from '@fxts/core'
import { useAgent } from '@zzz-picker/provider/hooks'
import { motion, AnimatePresence } from 'motion/react'

type Props = {
  className?: string
  flat?: boolean
  id: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Profile: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size)
  const agent = useAgent(props.id)

  return (
    <div
      className={pipe(
        ['overflow-hidden', 'flex', 'items-end', size],
        concat([props.className || '']),
        concat(props.flat ? ['rounded-none!'] : []),
        join(' ')
      )}
      style={{ backgroundColor: agent?.color || 'var(--color-netural)' }}
    >
      <AnimatePresence>
        {agent && (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            src={agent.profile.url}
            alt={agent.nameKo}
            className="block w-full"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
