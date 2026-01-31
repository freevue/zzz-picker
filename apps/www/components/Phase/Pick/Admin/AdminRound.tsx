import { AdminBoss } from './AdminBoss'
import { AdminPickSide } from './AdminPickSide'
import { pipe, join } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { SelectAgent } from '@zzz-picker/constant'

type Props = {
  roundId: 'personal' | 'common'
  title: string
  data: {
    A: {
      pickList: SelectAgent[]
      costList: number[]
    }
    B: {
      pickList: SelectAgent[]
      costList: number[]
    }
    boss: {
      A?: number | null
      B?: number | null
      common?: number | null
    }
  }
  banAgents?: number[]
  onUpdate: (updates: any) => void
}

export const AdminRound: React.FC<Props> = ({ roundId, title, data, banAgents, onUpdate }) => {
  return (
    <div className="w-full">
      <Typo.Heading className={pipe(['heading-3xl text-ink text-center mb-4'], join(' '))}>
        {title}
      </Typo.Heading>
      <div className="flex gap-10 items-center mt-8">
        <AdminPickSide
          side="A"
          pickList={data.A.pickList}
          costList={data.A.costList}
          banAgents={banAgents}
          onPickChange={(newPicks) => onUpdate({ side: 'A', roundId, picks: newPicks })}
          onPickClick={(agentId, index) =>
            onUpdate({ side: 'A', roundId, detail: { agentId, index } })
          }
        />
        <div className="flex items-center justify-center w-48">
          <AdminBoss
            roundId={roundId}
            boss={data.boss}
            onUpdate={(updates) => onUpdate({ ...updates, roundId })}
            onClick={(bossSide) => onUpdate({ base: { boss: true, side: bossSide, roundId } })}
          />
        </div>
        <AdminPickSide
          side="B"
          pickList={data.B.pickList}
          costList={data.B.costList}
          banAgents={banAgents}
          onPickChange={(newPicks) => onUpdate({ side: 'B', roundId, picks: newPicks })}
          onPickClick={(agentId, index) =>
            onUpdate({ side: 'B', roundId, detail: { agentId, index } })
          }
        />
      </div>
    </div>
  )
}
