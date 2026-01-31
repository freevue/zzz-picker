import { join, pipe, concat } from '@fxts/core'
import { Form } from '@zzz-picker/components/v2'
import type { SelectAgent, Side } from '@zzz-picker/constant'
import { useSetting } from '@zzz-picker/provider/hooks'

type Props = {
  side: Side
  pickList: SelectAgent[]
  costList: number[]
  banAgents?: number[]
  onPickChange?: (newPicks: SelectAgent[]) => void
  onPickClick?: (agentId: SelectAgent, index: number) => void
}

export const AdminPickSide: React.FC<Props> = ({
  side,
  pickList,
  costList,
  banAgents = [],
  onPickChange,
  onPickClick,
}) => {
  const { state: settingState } = useSetting()

  return (
    <div className="w-[336px]">
      <div
        className={pipe(
          ['w-full flex flex-col', 'gap-4'],
          concat([side === 'A' ? 'items-start' : 'items-end']),
          join(' ')
        )}
      >
        <Form.Party
          size="md"
          reverse={side === 'B'}
          value={pickList}
          cost={costList}
          allowAgents={settingState.allowAgent}
          banAgents={banAgents}
          deleteable={!!onPickChange}
          onChange={onPickChange}
          onClick={(id, idx) => onPickClick?.(id, idx || 0)}
          disabledHover
        />
      </div>
    </div>
  )
}
