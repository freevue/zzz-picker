import { pipe, map, toArray, concat, join, includes } from '@fxts/core'
import type { Agent, AgentId } from '@zzz-picker/constant'

type Props = {
  agents: Agent[]
  selectedInCurrent: AgentId[]
  otherRoundAgents: AgentId[]
  bannedAgents: AgentId[]
  active: boolean
  isCurrentRoundFull: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AgentGrid: React.FC<Props> = ({
  agents,
  selectedInCurrent,
  otherRoundAgents,
  bannedAgents,
  active,
  isCurrentRoundFull,
  onClick,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <ul
        className={pipe(
          ['grid', 'gap-2', 'gap-y-5', 'p-4', 'w-full', 'max-w-2xl', 'mx-auto'],
          concat(['grid-cols-3', 'sm:grid-cols-4']),
          join(' ')
        )}
      >
        {pipe(
          agents,
          map((agent) => {
            const isSelectedInCurrent = includes(agent.id, selectedInCurrent)
            const isSelectedInOther = includes(agent.id, otherRoundAgents)
            const isBanned = includes(agent.id, bannedAgents)
            // 비활성화 조건: Ban됨 또는 다른 라운드에서 선택됨 또는 (슬롯 꽉 참 && 현재 라운드에서 미선택)
            const isDisabled =
              !active ||
              isBanned ||
              isSelectedInOther ||
              (isCurrentRoundFull && !isSelectedInCurrent)

            return (
              <li key={agent.id}>
                <button
                  type="button"
                  aria-selected={isSelectedInCurrent}
                  value={agent.id}
                  onClick={onClick}
                  className={pipe(
                    ['block', 'mx-auto', 'cursor-pointer', 'group', 'w-full'],
                    concat(['disabled:opacity-40', 'disabled:cursor-not-allowed']),
                    join(' ')
                  )}
                  disabled={isDisabled}
                >
                  <div
                    style={{
                      backgroundColor: agent.color || 'transparent',
                    }}
                    className={pipe(
                      [
                        'card-2',
                        'inverse',
                        'w-full',
                        'max-w-24',
                        'mx-auto',
                        'aspect-square',
                        'ring-2',
                        'ring-transparent',
                        'transition-all',
                        'duration-200',
                      ],
                      concat(['group-aria-selected:ring-primary', 'group-aria-selected:scale-105']),
                      join(' ')
                    )}
                  >
                    <img src={agent.profile.url} alt={agent.nameKo} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold mt-1 text-ink block text-center truncate">
                    {agent.nameKo}
                  </span>
                </button>
              </li>
            )
          }),
          toArray
        )}
      </ul>
    </div>
  )
}

export default AgentGrid
