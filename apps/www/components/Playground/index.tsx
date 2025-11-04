import BottomSheet from './BottomSheet'
import Nickname from './Nickname'
import Reset from './Reset'
import Round from './Round'
import TotalScore from './TotalScore'
import { useStore } from '@/hooks'
import { useLocation } from '@remix-run/react'
import { Typo } from '@zzz-picker/components/v2'
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
          <div className="flex w-full p-4 gap-5 items-center bg-base sticky top-0 z-10">
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
          <Reset />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Side
