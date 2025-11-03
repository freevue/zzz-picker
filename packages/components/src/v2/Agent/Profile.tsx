import { useRoundedSize } from '..'
import { pipe, concat, join } from '@fxts/core'
import { motion, AnimatePresence } from 'motion/react'

type Props = {
  url?: string
  color?: string
  className?: string
  flat?: boolean
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Profile: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size)

  return (
    <div
      className={pipe(
        ['overflow-hidden', size],
        concat([props.className || '']),
        concat(props.flat ? ['rounded-none!'] : []),
        join(' ')
      )}
      style={{ backgroundColor: props.color || 'var(--color-content)' }}
    >
      <AnimatePresence>
        {props.url && (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            src={props.url}
            alt={props.alt || ''}
            className="block w-full"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
