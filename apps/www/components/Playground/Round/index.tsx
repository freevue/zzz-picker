import { Common, Double } from './BossButton'
import Pick from './Pick'
import { Typo } from '@zzz-picker/components/v2'
import type { RoundId } from '@zzz-picker/constant'
import { usePlay } from '@zzz-picker/provider/hooks'
import { useMemo } from 'react'

type Props = {
  id: RoundId
}

const Round: React.FC<Props> = (props) => {
  const { state } = usePlay()
  const round = useMemo(() => state[props.id], [state, props.id])

  return (
    <div className="w-full">
      <Typo.Heading className="heading-3xl text-ink text-center">{round.title}</Typo.Heading>
      <div className="flex justify-between items-center -mt-14">
        <Pick side="A" key={`${props.id}-A`} roundId={props.id} />
        <div className="flex items-center justify-center w-44">
          {props.id === 'common' ? <Common /> : <Double roundId={props.id} />}
        </div>
        <Pick side="B" key={`${props.id}-B`} roundId={props.id} />
      </div>
    </div>
  )
}

export default Round
