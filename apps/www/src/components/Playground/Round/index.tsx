import { Common, Personal } from './BossButton'
import Pick from './Pick'
import { usePlay } from '@/hooks'
import { Typo } from '@zzz-picker/components'
import type { RoundId } from '@zzz-picker/constant'
import { useMemo } from 'react'

type Props = {
  id: RoundId
}

const Round: React.FC<Props> = (props) => {
  const { state } = usePlay()
  const round = useMemo(() => state[props.id], [state, props.id])

  return (
    <div className="w-full">
      <Typo.Heading className="text-2xl font-bold text-text-primary text-center">
        {round.title}
      </Typo.Heading>
      <div className="flex justify-between items-center -mt-11">
        <Pick side="A" roundId={props.id} />
        <div className="flex items-center justify-center w-44">
          {props.id === 'common' && <Common />}
          {props.id === 'personal' && <Personal />}
        </div>
        <Pick side="B" roundId={props.id} />
      </div>
    </div>
  )
}

export default Round
