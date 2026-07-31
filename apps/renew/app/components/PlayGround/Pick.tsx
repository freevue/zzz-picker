import AgentSelector from './AgentSelector'
import BossSelector from './BossSelector'
import Cost from './Cost'
import RoundTab from './RoundTab'
import { useState } from 'react'
import { PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
}

const Pick: React.FC<Props> = (props) => {
  const [round, setRound] = useState<number>(0)

  return (
    <div className="w-full h-full overflow-y-scroll pt-28 pb-14 px-4 scrollbar-hidden">
      <RoundTab list={[0, 1]} onChange={setRound} acitve={round} />
      <BossSelector round={round} role={props.role} />
      <AgentSelector round={round} role={props.role} />
      <Cost />
    </div>
  )
}

export default Pick
