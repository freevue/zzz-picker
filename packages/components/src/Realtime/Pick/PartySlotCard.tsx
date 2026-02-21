import { pipe, concat, join } from '@fxts/core'
import { Plus } from '@zzz-picker/components/icons'
import type { SelectAgent } from '@zzz-picker/constant'
import { useAgent } from '@zzz-picker/provider'

type Props = {
  agentId: SelectAgent
  index: number
  cost?: number
  onClick?: () => void
}

/**
 * 파티 슬롯 캐릭터 카드
 */
const PartySlotCard: React.FC<Props> = ({ agentId, cost, onClick }) => {
  const agent = useAgent(agentId || 0)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={agentId ? onClick : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          agentId && onClick?.()
        }
      }}
      className={pipe(
        [
          'relative',
          'aspect-square',
          'w-full',
          'overflow-hidden',
          'card-2',
          'inverse',
          'transition-all',
          'duration-200',
          'group/slot',
        ],
        concat(
          agentId
            ? ['cursor-pointer', 'ring-2', 'ring-transparent', 'hover:ring-primary']
            : ['bg-content', 'flex', 'items-center', 'justify-center']
        ),
        join(' ')
      )}
    >
      {agentId && agent ? (
        <>
          <div className="size-full" style={{ backgroundColor: agent.color || 'transparent' }}>
            <img
              src={agent.profile.url}
              alt={agent.nameKo}
              className="block w-full h-full object-cover"
            />
          </div>
          {/* Cost 표시 (좌상단) */}
          {cost !== undefined && cost >= 0 && (
            <div
              className={pipe(
                [
                  'absolute',
                  'top-0',
                  'left-0',
                  'bg-base/70',
                  'backdrop-blur-sm',
                  'px-2',
                  'py-0.5',
                  'rounded-br-lg',
                ],
                join(' ')
              )}
            >
              <span className="text-ink text-sm font-black">{cost}</span>
            </div>
          )}
        </>
      ) : (
        <Plus className="size-1/2 stroke-ink" />
      )}
    </div>
  )
}

export default PartySlotCard
