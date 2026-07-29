import CardTitle from '../CardTitle'
import { pipe, join, concat, map, filter, toArray } from '@fxts/core'
import { useStore } from '~/hooks'

const AllowAgent: React.FC = () => {
  const store = useStore()

  return (
    <div className="">
      <CardTitle>Allow</CardTitle>
      <ul className="flex gap-2">
        {pipe(
          store.agents,
          filter(([, agent]) => agent.isAllow),
          map(([id, agent]) => (
            <li key={id}>
              <div className="size-22 rounded-2xl overflow-hidden">
                <img
                  className="block w-full"
                  style={{ backgroundColor: agent.color || 'transparent' }}
                  src={agent.profile}
                  alt={agent.nameKo}
                />
              </div>
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default AllowAgent
