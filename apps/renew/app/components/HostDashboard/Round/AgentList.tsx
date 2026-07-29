import { pipe, map, zipWithIndex, toArray, isUndefined, join, concat } from '@fxts/core'
import { Icon } from '~/components'
import { useMatchState, useStore } from '~/hooks'
import { type PlayerRole } from '~/type'

type Props = {
  list: Array<number | null>
  engines: Array<string | null>
  role: PlayerRole
}

const AgentList: React.FC<Props> = (props) => {
  const store = useStore()
  const matchState = useMatchState()

  return (
    <ul className="flex gap-2">
      {pipe(
        props.list,
        map((agentId) => store.agents.get(agentId || -1)),
        zipWithIndex,
        map(([index, agent]) => ({
          index,
          agent,
          engine: store.engines.get(props.engines[index] || ''),
        })),
        map(({ index, agent, engine }) => (
          <li key={index}>
            <div className="relative">
              <button
                type="button"
                className="size-22 text-4xl bg-accent rounded-2xl overflow-hidden"
              >
                {isUndefined(agent) ? (
                  <Icon.Plus className="scale-75" />
                ) : (
                  <img
                    className="block w-full"
                    style={{ backgroundColor: agent.color || 'transparent' }}
                    src={agent.profile}
                    alt={agent.nameKo}
                  />
                )}
              </button>
              <button
                className={pipe(
                  ['absolute -bottom-2 -right-2 size-10 rounded-xl'],
                  concat(
                    isUndefined(engine)
                      ? ['bg-accent', 'border-2 border-solid border-content']
                      : ['backdrop-blur-lg']
                  ),
                  join(' ')
                )}
              >
                {isUndefined(engine) ? (
                  <Icon.Plus className="scale-75" />
                ) : (
                  <img src={engine.icon} alt={engine.nameKo} />
                )}
              </button>
            </div>
            <div className="text-center ft-ria text-lg mt-2 h-7">
              {!isUndefined(agent) && (
                <>
                  {matchState.state.rate[props.role].agents[agent.id] || 0} /{' '}
                  {matchState.state.rate[props.role].engines[engine?.id || 0] || 0}
                </>
              )}
            </div>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default AgentList
