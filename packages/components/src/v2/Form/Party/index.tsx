import { useRoundedSize } from '../..'
import Button from './Button'
import { pipe, concat, join, map, toArray, zipWithIndex, findIndex, filter } from '@fxts/core'
import type { AgentId, SelectAgent } from '@zzz-picker/constant'

type Props = {
  disabledHover?: boolean
  value: SelectAgent[]
  cost?: number[]
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  deleteable?: boolean
  allowAgents?: AgentId[]
  banAgents?: AgentId[]
  filterAgents?: AgentId[]
  reverse?: boolean
  color?: string
  hideEmpty?: boolean
  focusId?: AgentId
  activeIndices?: number[]
  onChange?: (value: SelectAgent[]) => void
  onClick?: (agentId: AgentId, index?: number) => void
}

const Party: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size, props.reverse)

  const onClick = (index: number) => (agentId: SelectAgent) => {
    pipe(
      [...props.value],
      (list: SelectAgent[]) => {
        const currentIndex = findIndex((id) => id === agentId, list)

        list[index] = agentId
        currentIndex >= 0 && (list[currentIndex] = null)

        return list
      },
      (list: SelectAgent[]) => props.onChange?.(list)
    )
  }
  const onDelete = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(
      [...props.value],
      (list: SelectAgent[]) => {
        list[index] = null

        return list
      },
      (list: SelectAgent[]) => props.onChange?.(list)
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
        filter(([_, agentId]: [number, SelectAgent]) => !props.hideEmpty || !!agentId),
        map(([index, agentId]: [number, SelectAgent]) => (
          <Button
            cost={props.cost?.[index]}
            color={props.color}
            onClick={(id) => props.onClick?.(id, index)}
            onSelect={props.onChange && onClick(index)}
            onDelete={onDelete(index)}
            size={props.size}
            id={agentId}
            key={index}
            active={props.activeIndices?.includes(index)}
            focusId={props.focusId}
            disabledHover={props.disabledHover}
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
