import { useRoundedSize } from '../..'
import Button from './Button'
import { pipe, concat, join, map, toArray, zipWithIndex, findIndex } from '@fxts/core'
import type { AgentId, SelectAgent } from '@zzz-picker/constant'

type Props = {
  value: SelectAgent[]
  cost?: number[]
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  deleteable?: boolean
  allowAgents?: AgentId[]
  banAgents?: AgentId[]
  filterAgents?: AgentId[]
  reverse?: boolean
  onChange?: (value: SelectAgent[]) => void
  onClick?: (agentId: AgentId) => void
}

const Party: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size, props.reverse)

  const onClick = (index: number) => (agentId: SelectAgent) => {
    pipe(
      [...props.value],
      (list) => {
        const currentIndex = findIndex((id) => id === agentId, list)

        list[index] = agentId
        currentIndex >= 0 && (list[currentIndex] = null)

        return list
      },
      (list) => props.onChange?.(list)
    )
  }
  const onDelete = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(
      [...props.value],
      (list) => {
        list[index] = null

        return list
      },
      (list) => props.onChange?.(list)
    )
  }

  return (
    <div
      className={pipe(
        ['flex', 'w-fit!', 'overflow-hidden', size],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {pipe(
        props.value,
        zipWithIndex,
        map(([index, agentId]) => (
          <Button
            cost={props.cost?.[index]}
            onClick={props.onClick}
            onSelect={onClick(index)}
            onDelete={onDelete(index)}
            size={props.size}
            id={agentId}
            key={index}
            filterAgents={props.filterAgents}
            deleteable={props.deleteable}
            allowAgents={props.allowAgents}
            banAgents={props.banAgents}
          />
        )),
        toArray
      )}
    </div>
  )
}

export default Party
