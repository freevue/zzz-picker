import { pipe, map, zipWithIndex, toArray, isUndefined } from '@fxts/core'
import { useStore } from '~/hooks'

type Props = {
  list: Array<number | null>
  engines: Array<string | null>
}

const AgentList: React.FC<Props> = (props) => {
  const store = useStore()

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
              <button type="button" className="size-22 text-4xl card rounded-2xl overflow-hidden">
                {isUndefined(agent) ? (
                  '+'
                ) : (
                  <img
                    className="block w-full"
                    style={{ backgroundColor: agent.color || 'transparent' }}
                    src={agent.profile}
                    alt={agent.nameKo}
                  />
                )}
              </button>
              <button className="absolute -bottom-2 -right-2 size-10 card rounded-xl">
                {isUndefined(engine) ? '+' : <img src={engine.icon} alt={engine.nameKo} />}
              </button>
            </div>
            <div className="text-center ft-ria text-lg mt-2">2 / 2</div>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default AgentList
