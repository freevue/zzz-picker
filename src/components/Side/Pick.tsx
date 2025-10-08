import type { Side } from '.'
import { Plus, Cross } from '@/Icons'
import { getAgentSquareImage } from '@/utils'
import { pipe, join, concat, range, map, toArray } from '@fxts/core'
import { useState } from 'react'

type Props = {
  side: Side
}

const Drop: React.FC<Props> = (props) => {
  const [agentId, setAgentId] = useState<number | null>(null)

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const agentId = event.dataTransfer.getData('text/plain')
    console.log(agentId)

    setAgentId(Number(agentId))
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      draggable={false}
      className={pipe(
        ['size-24', 'border-2', 'border-white', 'border-r-0', 'last:border-r-2', 'overflow-hidden'],
        concat(props.side === 'A' ? ['skew-x-12'] : ['-skew-x-12']),
        join(' ')
      )}
    >
      <div
        className={pipe(
          ['w-full', 'h-full', 'flex', 'items-center', 'justify-center'],
          concat(props.side === 'A' ? ['-skew-x-12'] : ['skew-x-12']),
          join(' ')
        )}
      >
        {agentId ? (
          <div className="w-full h-full group">
            <img
              draggable={false}
              src={getAgentSquareImage(agentId)}
              alt=""
              className="block w-full"
            />
            <button
              type="button"
              onClick={() => setAgentId(null)}
              className="absolute left-0 top-0 w-full h-full flex items-center justify-center cursor-pointer backdrop-blur-sm scale-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Cross className="block size-8 stroke-white" />
            </button>
          </div>
        ) : (
          <button type="button" className="size-8 cursor-pointer">
            <Plus className="block w-full stroke-white" />
          </button>
        )}
      </div>
    </div>
  )
}
const Pick: React.FC<Props> = (props) => {
  return (
    <div className={pipe(['flex'], concat(props.side === 'A' ? ['pl-4'] : ['pr-4']), join(' '))}>
      {pipe(
        3,
        range,
        map((index) => <Drop key={index} {...props} />),
        toArray
      )}
    </div>
  )
}

export default Pick
