import { useAgent, useSetting } from '@/hooks'
import { pipe, map, toArray } from '@fxts/core'
import { Typo } from '@zzz-picker/components'

const Agent: React.FC<{ id: number }> = (props) => {
  const agent = useAgent(props.id)

  return agent ? (
    <li className="size-24 overflow-hidden">
      <img
        src={agent.profile.url}
        style={{ backgroundColor: agent.color || 'transparent' }}
        className="block w-full"
        alt={agent.nameKo}
      />
    </li>
  ) : null
}
const AllowAgent = () => {
  const { state } = useSetting()

  return state.allowAgent.length ? (
    <div className="flex-1 overflow-hidden p-4">
      <Typo.Heading className="text-xl" primary>
        Allow
      </Typo.Heading>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
        <ul className="flex w-fit rounded-bl-2xl rounded-tr-2xl overflow-hidden">
          {pipe(
            state.allowAgent,
            map((id) => <Agent id={id} key={id} />),
            toArray
          )}
        </ul>
      </div>
    </div>
  ) : null
}

export default AllowAgent
