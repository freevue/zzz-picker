import { pipe, map, toArray, zipWithIndex, isUndefined } from '@fxts/core'
import { useStore } from '~/hooks'

type Props = {
  list: Array<null | number>
}

const List: React.FC<Props> = ({ list }) => {
  const store = useStore()

  return (
    <ul className="flex gap-2">
      {pipe(
        list,
        map((agentId) => store.agents.get(agentId || 0)),
        zipWithIndex,
        map(([index, agent]) => (
          <li key={index}>
            <div className="rounded-2xl bg-accent w-20 aspect-square overflow-hidden">
              {isUndefined(agent) ? (
                <></>
              ) : (
                <img
                  className="block w-full"
                  style={{ backgroundColor: agent.color || 'transparent' }}
                  src={agent?.profile}
                />
              )}
            </div>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default List
