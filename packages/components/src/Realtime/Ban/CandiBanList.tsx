import CandiBanItem from './CandiBanItem'
import { pipe, map, toArray } from '@fxts/core'
import type { AgentId } from '@zzz-picker/constant'

type Props = {
  list: AgentId[]
  activeId: AgentId | null
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const CandiBanList: React.FC<Props> = (props) => {
  return props.list.length === 0 ? null : (
    <ul className="flex gap-2 justify-center my-4">
      {pipe(
        props.list,
        map((agentId) => (
          <CandiBanItem
            active={agentId === props.activeId}
            onClick={props.onClick}
            key={agentId}
            agentId={agentId}
          />
        )),
        toArray
      )}
    </ul>
  )
}

export default CandiBanList
