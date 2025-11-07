import BottomSheet from './BottomSheet'
import Floating from './Floating'
import Nickname from './Nickname'
import Round from './Round'
import TotalScore from './TotalScore'
import { useLocation } from '@remix-run/react'
import { Typo } from '@zzz-picker/components/v2'
import { useStore } from '@zzz-picker/provider/hooks'
import { AnimatePresence, motion } from 'motion/react'

const Side: React.FC = () => {
  const { loading } = useStore()
  const { pathname } = useLocation()

  return (
    <AnimatePresence>
      {loading ? null : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex w-full p-4 gap-5 items-center bg-base sticky top-0 z-30">
            <Nickname side="A" />
            <Typo.Heading className="heading-3xl text-ink">VS</Typo.Heading>
            <Nickname side="B" />
          </div>
          <div className="p-4 flex flex-col gap-20 mt-8">
            <Round id="personal" />
            <Round id={pathname === '/unlimited' ? 'unlimited' : 'common'} />
          </div>
          <div className="p-4 my-8">
            <TotalScore />
          </div>
          <BottomSheet />
          <Floating />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Side
