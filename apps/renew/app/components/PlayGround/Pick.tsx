import AgentSelector from './AgentSelector'
import BossSelector from './BossSelector'
import Cost from './Cost'
import RoundTab from './RoundTab'
import { useMatch } from '@/hooks'
import { pipe, range, toArray } from '@fxts/core'
import { useState } from 'react'
import { PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
}

const Pick: React.FC<Props> = (props) => {
  const { setting } = useMatch()
  const [round, setRound] = useState<number>(0)

  return (
    <div className="w-full h-full overflow-y-scroll pt-18 pb-14 px-4 scrollbar-hidden">
      <RoundTab
        list={pipe(setting.ROUND_COUNT, range, toArray)}
        onChange={setRound}
        acitve={round}
      />
      <BossSelector round={round} role={props.role} />
      <AgentSelector round={round} role={props.role} />
      <Cost />
    </div>
  )
}

export default Pick
