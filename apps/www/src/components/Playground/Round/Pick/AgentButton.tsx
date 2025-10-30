import CostDialog from '../CostDialog'
import { useAgent, usePlay, useSetting } from '@/hooks'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog, Icons } from '@zzz-picker/components'
import type { Side, RoundId } from '@zzz-picker/constant'
import { getAgentTotalCost } from '@zzz-picker/utils'
import { useMemo, useState } from 'react'

type Props = {
  side: Side
  index: number
  roundId: RoundId
  agentId: number
}

const AgentButton: React.FC<Props> = (props) => {
  const { cost, setState, setCost } = usePlay()
  const { costTable } = useSetting()
  const agent = useAgent(props.agentId)!
  const [isOpen, setIsOpen] = useState(false)
  const totalCost = useMemo(() => {
    const currentCost = cost[props.side].get(props.agentId)!

    return getAgentTotalCost(costTable, currentCost)
  }, [props.agentId, cost, costTable, props.side])

  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setCost((prev) => {
      const newCost = { ...prev }

      newCost[props.side].delete(props.agentId)

      return newCost
    })
    setState((prev) => {
      const pickList = [...prev[props.roundId][props.side].pickList]

      pickList[props.index] = null

      return {
        ...prev,
        [props.roundId]: {
          ...prev[props.roundId],
          [props.side]: { ...prev[props.roundId][props.side], pickList },
        },
      }
    })
  }

  if (!agent) return null

  return (
    <>
      <div
        className={pipe(
          ['relative', 'w-full', 'h-full', 'overflow-hidden'],
          concat(
            props.side === 'A'
              ? ['group-first/list:rounded-bl-2xl', 'group-last/list:rounded-tr-2xl']
              : ['group-last/list:rounded-br-2xl', 'group-first/list:rounded-tl-2xl']
          ),
          join(' ')
        )}
      >
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className={pipe(
            ['group/button', 'relative', 'w-full', 'h-full', 'overflow-hidden'],
            concat([]),
            join(' ')
          )}
        >
          <span className="absolute left-0 top-0 h-8 min-w-8 w-fit px-2 flex items-center justify-center bg-content/70 backdrop-blur-lg text-foreground font-bold text-lg">
            {totalCost}
          </span>
          <div className="w-full h-full" style={{ backgroundColor: agent.color || 'transparent' }}>
            <img className="block w-full" src={agent.profile.url} alt={agent.nameKo} />
          </div>
        </Button>
        <Button
          type="button"
          className="absolute right-0 top-0 group size-8 flex items-center justify-center bg-content/70 backdrop-blur-lg text-foreground font-bold text-lg"
          onClick={onDeleteClick}
        >
          <Icons.Cross className="stroke-foreground size-6 group-hover:stroke-secondary" />
        </Button>
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CostDialog
          roundId={props.roundId}
          side={props.side}
          agentId={props.agentId}
          totalCost={totalCost}
        />
      </Dialog>
    </>
  )
}

export default AgentButton
