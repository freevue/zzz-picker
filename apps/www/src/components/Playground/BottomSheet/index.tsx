import AllowAgent from './AllowAgent'
import BanAgent from './BanAgent'
import { useStore } from '@/hooks'
import { AnimatePresence, motion } from 'motion/react'

const BottomSheet = () => {
  const { agent } = useStore()

  return (
    <AnimatePresence>
      {agent.size > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky bottom-0 left-0 w-full p-4 bg-content/50 backdrop-blur-lg"
        >
          <div className="flex w-full flex-1 gap-4 overflow-hidden">
            <AllowAgent />
            <BanAgent />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BottomSheet
