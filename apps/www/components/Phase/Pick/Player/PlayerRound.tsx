import { AdminBoss } from '../Admin/AdminBoss'
import { AdminPickSide } from '../Admin/AdminPickSide'
import { pipe, join } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { SelectAgent, Side } from '@zzz-picker/constant'

type Props = {
  roundId: 'personal' | 'common'
  title: string
  side: Side
  data: {
    pickList: SelectAgent[]
    costList: number[]
    boss?: number | null
  }
  banAgents?: number[]
  onUpdate: (updates: any) => void
}

export const PlayerRound: React.FC<Props> = ({
  roundId,
  title,
  side,
  data,
  banAgents,
  onUpdate,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Typo.Heading className={pipe(['heading-3xl text-ink text-center mb-4'], join(' '))}>
        {title}
      </Typo.Heading>
      <div className="flex flex-col items-center gap-6">
        <AdminPickSide
          side={side}
          pickList={data.pickList}
          costList={data.costList}
          banAgents={banAgents}
          onPickChange={(newPicks) => onUpdate({ side, roundId, picks: newPicks })}
          onPickClick={(agentId, index) => onUpdate({ side, roundId, detail: { agentId, index } })}
        />
        <div className="flex items-center justify-center">
          <AdminBoss
            roundId={roundId}
            singleSide={side}
            boss={roundId === 'common' ? { common: data.boss } : { [side]: data.boss }}
            onUpdate={(updates) => onUpdate({ ...updates, roundId })}
          />
        </div>
      </div>
    </div>
  )
}
