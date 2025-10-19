import CostDialog from '../CostDialog'
import { useAgent, usePlay2 } from '@/hooks'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog, Icons } from '@zzz-picker/components'
import type { Side, TypePick } from '@zzz-picker/provider'
import { useMemo, useState } from 'react'

type Props = {
  side: Side
  index: number
  roundId: number
} & TypePick

const AgentButton: React.FC<Props> = (props) => {
  const { setRoundPick } = usePlay2()
  const agent = useAgent(props.agent!)
  const [isOpen, setIsOpen] = useState(false)
  const totalCost = useMemo(() => {
    return pipe(
      props.setting,
      (setting) => setting.rate + (setting.engineType ? setting.engineRate : 0)
    )
  }, [props.setting])

  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setRoundPick(props.roundId, props.side, props.index, null)
  }

  if (!agent) return null

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          ['w-full', 'h-full', 'overflow-hidden', 'group/button', 'relative'],
          concat(
            props.side === 'A'
              ? ['group-first/list:rounded-bl-2xl', 'group-last/list:rounded-tr-2xl']
              : ['group-last/list:rounded-br-2xl', 'group-first/list:rounded-tl-2xl']
          ),
          join(' ')
        )}
      >
        <span className="absolute left-0 top-0 size-8 flex items-center justify-center bg-content/70 backdrop-blur-lg text-gray-50 font-bold text-lg">
          {totalCost}
        </span>
        <div className="w-full h-full" style={{ backgroundColor: agent.color || 'transparent' }}>
          <img
            className="block w-full"
            src={agent.chzzkSquareImage || agent.labSquareImage}
            alt={agent.nameKo}
          />
        </div>
        <Button
          type="button"
          className="absolute right-0 top-0 group size-8 flex items-center justify-center bg-content/70 backdrop-blur-lg text-gray-50 font-bold text-lg"
          onClick={onDeleteClick}
        >
          <Icons.Cross className="dark:stroke-gray-50 size-6 group-hover:stroke-secondary" />
        </Button>
      </Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CostDialog
          roundId={props.roundId}
          side={props.side}
          agentId={props.agent!}
          index={props.index}
        />
      </Dialog>
    </>
  )
}

export default AgentButton
