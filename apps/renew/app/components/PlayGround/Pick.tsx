import AgentSelector from './AgentSelector'
import BossSelector from './BossSelector'
import RoundTab from './RoundTab'
import { useState } from 'react'

const Pick: React.FC = () => {
  const [round, setRound] = useState<number>(0)

  return (
    <div className="w-full h-full overflow-y-scroll pt-28 pb-14 px-4 scrollbar-hidden">
      <RoundTab list={[0, 1]} onChange={setRound} acitve={round} />
      <BossSelector round={round} />
      <AgentSelector round={round} />
    </div>
  )
}

export default Pick
