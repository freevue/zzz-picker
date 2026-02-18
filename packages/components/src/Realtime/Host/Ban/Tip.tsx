import TipItem from './TipItem'
import { map, pipe, toArray } from '@fxts/core'
import type { AgentId } from '@zzz-picker/constant'
import { AnimatePresence, motion } from 'motion/react'

type Props = {
  list: AgentId[]
}

/**
 * 현재 밴을 위해 선택된 캐릭터를 보여주는 컴포넌트입니다.
 */

const Tip: React.FC<Props> = (props) => {
  return (
    <AnimatePresence>
      {props.list.length === 0 ? null : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 top-full translate-y-4 -translate-x-1/2"
        >
          <ul className="card bg-base min-h-20 flex w-fit">
            {pipe(
              props.list,
              map((id) => <TipItem key={id} id={id} />),
              toArray
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Tip
