import { UI } from '@/components'
import { useAgent, useSetting2 } from '@/hooks'
import { pipe, map, toArray } from '@fxts/core'

const Agent: React.FC<{ id: number }> = (props) => {
  const agent = useAgent(props.id)

  return agent ? (
    <li className="size-24 overflow-hidden">
      <img
        src={agent.labSquareImage}
        style={{ backgroundColor: agent.color || 'transparent' }}
        className="block w-full"
        alt=""
      />
    </li>
  ) : null
}
const AllowAgent = () => {
  const { setting } = useSetting2()

  return setting.allowAgent.length ? (
    <div className="flex-1 overflow-hidden">
      <UI.Typo.Heading className="text-xl" primary>
        Allow
      </UI.Typo.Heading>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
        <ul className="flex w-fit rounded-bl-2xl rounded-tr-2xl overflow-hidden">
          {pipe(
            setting.allowAgent,
            map((id) => <Agent id={id} key={id} />),
            toArray
          )}
        </ul>
      </div>
    </div>
  ) : null
}

export default AllowAgent
