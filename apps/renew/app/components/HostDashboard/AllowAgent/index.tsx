import CardTitle from '../CardTitle'
import { pipe, map, filter, toArray, size } from '@fxts/core'
import { useMemo } from 'react'
import { useStore } from '~/hooks'

const AllowAgent: React.FC = () => {
  const store = useStore()
  const list = useMemo(() => {
    return pipe(
      store.agents,
      filter(([, agent]) => agent.isAllow)
    )
  }, [store.agents])

  if (size(list) === 0) return null

  return (
    <div className="">
      <CardTitle>Allow</CardTitle>
      <ul className="flex gap-2 flex-wrap">
        {pipe(
          list,
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
