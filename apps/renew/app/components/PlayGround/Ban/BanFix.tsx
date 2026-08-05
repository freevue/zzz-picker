import { filter, map, pipe, toArray, join, concat, includes, isNumber, size } from '@fxts/core'
import { SETTING } from '~/constant'
import { useStore } from '~/hooks'

type Props = {
  proposeBan: Array<number | null>
  active: Array<number | null>
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const BanFix: React.FC<Props> = (props) => {
  const store = useStore()

  return (
    <div className="fixed inset-0 backdrop-blur-xl z-20">
      <div className="w-full h-full flex items-center justify-around max-w-lg mx-auto p-4">
        {pipe(
          props.proposeBan,
          map((agentId) => store.agents.get(agentId as number)!),
          map((agent) => (
            <button
              onClick={props.onClick}
              value={agent.id}
              type="button"
              disabled={
                !includes(agent.id, props.active) &&
                size(filter(isNumber, props.active)) >= SETTING.MAX_PLAYER_BAN_FIX
              }
              className={pipe(
                [
                  'cursor-pointer',
                  'card',
                  'block',
                  'relative',
                  'w-2/5',
                  'aspect-square',
                  'p-2',
                  'rounded-2xl',
                  'overflow-hidden',
                ],
                concat(includes(agent.id, props.active) ? ['active'] : []),
                concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                join(' ')
              )}
              key={agent.id}
            >
              <div
                className="w-full aspect-square overflow-hidden rounded-xl z-1 relative"
                style={{ backgroundColor: agent.color || 'transparent' }}
              >
                <img className="w-full block" src={agent.profile} alt={agent.nameKo} />
              </div>
            </button>
          )),
          toArray
        )}
      </div>
    </div>
  )
}

export default BanFix
