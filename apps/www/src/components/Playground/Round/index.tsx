import BossButton from './BossButton'
import Pick from './Pick'
import { Typo } from '@zzz-picker/components'
import type { TypeRound } from '@zzz-picker/provider'

type Props = {
  id: number
  round: TypeRound
}

const Round: React.FC<Props> = (props) => {
  return (
    <div className="w-full">
      <Typo.Heading className="text-2xl font-bold text-text-primary text-center">
        {props.round.name}
      </Typo.Heading>
      <div className="flex justify-between items-center -mt-11 gap-8">
        <Pick side="A" roundId={props.id} round={props.round} />
        <div className="flex items-center">
          <BossButton boss={props.round.boss} roundId={props.id} />
        </div>
        <Pick side="B" roundId={props.id} round={props.round} />
      </div>
    </div>
  )
}

export default Round
