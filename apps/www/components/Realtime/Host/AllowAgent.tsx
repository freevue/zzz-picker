import { join, filter, isUndefined, map, pipe, toArray, concat } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { useSetting, useStore } from '@zzz-picker/provider/hooks'
import { useMemo } from 'react'

const AllowAgent = () => {
  const { agents } = useStore()
  const { state } = useSetting()
  const allowAgents = useMemo(() => {
    return pipe(
      state.allowAgent,
      map((agentId) => agents.get(agentId)!),
      filter((agent) => !isUndefined(agent)),
      toArray
    )
  }, [agents, state.allowAgent])

  return (
    <div className="overflow-hidden p-4">
      <Typo.Heading className="heading-3xl text-primary mb-4">Allow Agent</Typo.Heading>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
        <ul className="card bg-base min-h-24 flex w-fit">
          {pipe(
            allowAgents,
            map((agent) => (
              <li
                className={pipe(
                  ['size-24', 'relative'],
                  concat([
                    'not-first:before:block',
                    'not-first:before:absolute',
                    'not-first:before:w-1',
                    'not-first:before:h-2/3',
                    'not-first:before:rounded-full',
                    'not-first:before:bg-netural',
                    'not-first:before:left-0',
                    'not-first:before:top-1/2',
                    'not-first:before:-translate-x-1/2',
                    'not-first:before:-translate-y-1/2',
                    'not-first:before:z-10',
                  ]),
                  join(' ')
                )}
                key={agent.id}
              >
                <img
                  src={agent.profile.url}
                  className="block w-full h-full object-cover"
                  alt={agent.nameKo}
                />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
    </div>
  )
}

export default AllowAgent
