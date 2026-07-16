import { pipe, map, zipWithIndex, toArray, isUndefined } from '@fxts/core'
import { useStore } from '~/hooks'

type Props = {
  list: Array<number | null>
}

const AgentList: React.FC<Props> = (props) => {
  const store = useStore()

  return (
    <ul className="flex gap-2">
      {pipe(
        props.list,
        map((agentId) => store.agents.get(agentId || -1)),
        zipWithIndex,
        map(([index, agent]) => (
          <li key={index}>
            <button type="button" className="size-24">
              {isUndefined(agent) ? '+' : <img src={agent.profile} alt={agent.nameKo} />}
            </button>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default AgentList
