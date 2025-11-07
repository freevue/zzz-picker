import Reset from './Reset'
import Save from './Save'
import { pipe, join, concat } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

const Floating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={pipe(['fixed', 'right-4', 'bottom-4'], concat(['group:']), join(' '))}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: -0.2,
                  delayChildren: 0.2,
                },
              },
              exit: {
                opacity: 0,
                y: 10,
                transition: {
                  staggerChildren: -0.2,
                  staggerDirection: -1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-2 mb-2"
          >
            <motion.li
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 10 },
              }}
            >
              <Save />
            </motion.li>
            <motion.li
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 10 },
              }}
            >
              <Reset />
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
      <div
        className="size-12 rounded-full bg-primary flex items-center justify-center"
        onMouseEnter={() => setIsOpen(true)}
      >
        <Icons.Plus
          className={pipe(
            ['size-8', 'stroke-content', 'transition-transform', 'duration-200'],
            concat(isOpen ? ['rotate-135'] : []),
            join(' ')
          )}
        />
      </div>
    </div>
  )
}

export default Floating
