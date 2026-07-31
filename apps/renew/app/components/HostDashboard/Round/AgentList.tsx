import { pipe, map, zipWithIndex, toArray, isUndefined, join, concat } from '@fxts/core'
import { Icon } from '~/components'
import { useStore } from '~/hooks'
import type { AgentSlot, EngineSlot, PlayerRole } from '~/type'

type Props = {
  list: Array<AgentSlot>
  engines: Array<EngineSlot>
  role: PlayerRole
}

const AgentList: React.FC<Props> = (props) => {
  const store = useStore()

  return (
    <ul className="flex gap-4">
      {pipe(
        props.list,
        map((agent) => store.agents.get(agent.id || -1)),
        zipWithIndex,
        map(([index, agent]) => ({
          index,
          agent,
          agentRate: props.list[index].rate,
          engine: store.engines.get(props.engines[index].id || ''),
          engineRate: props.engines[index].rate,
        })),
        map(({ index, agent, engine, agentRate, engineRate }) => (
          <li key={index}>
            <div className="relative">
              <button
                type="button"
                className="size-30 text-4xl bg-accent rounded-2xl overflow-hidden"
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
                  [
                    'absolute -bottom-3 -right-3 size-12 rounded-full',
                    'border-2 border-solid border-content',
                  ],
                  concat(isUndefined(engine) ? ['bg-accent'] : ['backdrop-blur-lg']),
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
            <div className="mt-2 h-7 flex gap-1 font-bold items-center justify-center">
              {!isUndefined(agent) && (
                <>
                  <p className="ft-pre">
                    <span className="ft-ria text-xl">{agentRate || 0}</span>
                    <span className="ml-1 text-lg">Lv</span>
                  </p>
                  <span className="ft-pre text-md mx-1 opacity-70">/</span>
                  <p className="ft-pre">
                    <span className="ft-ria text-xl">{engineRate || 0}</span>
                    <span className="ml-1 text-lg">Lv</span>
                  </p>
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
