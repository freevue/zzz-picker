import CostDialog from '../CostDialog'
import { useAgent, usePlay2 } from '@/hooks'
import type { Side } from '@/types'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import { useState } from 'react'

type Props = {
  side: Side
  index: number
  roundId: number
  agentId: number
}

const AgentButton: React.FC<Props> = (props) => {
  const { setRoundPick } = usePlay2()
  const agent = useAgent(props.agentId)
  const [isOpen, setIsOpen] = useState(false)

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setIsOpen(false)
    setRoundPick(props.roundId, props.side, props.index, Number(event.currentTarget.value))
  }

  if (!agent) return null

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          ['w-full', 'h-full', 'overflow-hidden', 'group/button'],
          concat(
            props.side === 'A'
              ? ['group-first/list:rounded-bl-2xl', 'group-last/list:rounded-tr-2xl']
              : ['group-last/list:rounded-br-2xl', 'group-first/list:rounded-tl-2xl']
          ),
          join(' ')
        )}
      >
        <div className="w-full h-full" style={{ backgroundColor: agent.color || 'transparent' }}>
          <img
            className="block w-full"
            src={agent.chzzkSquareImage || agent.labSquareImage}
            alt={agent.nameKo}
          />
        </div>
      </Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CostDialog roundId={props.roundId} side={props.side} agentId={props.agentId} />
      </Dialog>
    </>
  )
}

export default AgentButton
