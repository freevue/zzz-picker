import CostDialog from '../CostDialog'
import { useAgent, usePlay, useSetting } from '@/hooks'
import { concat, join, pipe, sum } from '@fxts/core'
import { Button, Dialog, Icons } from '@zzz-picker/components'
import type { Side, TypePick } from '@zzz-picker/provider'
import { useMemo, useState } from 'react'

type Props = {
  side: Side
  index: number
  roundId: number
} & TypePick

const AgentButton: React.FC<Props> = (props) => {
  const { setRoundPick } = usePlay()
  const { costTable } = useSetting()
  const agent = useAgent(props.agent!)!
  const [isOpen, setIsOpen] = useState(false)
  const agentRarityKey = useMemo(() => {
    if (agent.rarity === 'A') return 'AAlways'
    if (agent.rarity === 'S' && agent.isPickup) return 'SPick'

    return 'SAlways'
  }, [agent])
  const totalCost = useMemo(() => {
    const { used, rate } = costTable.agent[agentRarityKey]

    return pipe(
      props.setting,
      (setting) => {
        let engineList: number[] = []

        if (setting.engineType === 'S') {
          engineList = setting.engineType
            ? [costTable.engine[setting.engineType].used, setting.engineRate >= 4 ? 1 : 0]
            : [0]
        } else {
          engineList = setting.engineType
            ? [
                costTable.engine[setting.engineType].used,
                costTable.engine[setting.engineType].rate * setting.engineRate,
              ]
            : [0]
        }

        return [used, setting.rate * rate, ...engineList]
      },
      sum,
      (value) => Number((value * 100).toFixed(2)) / 100
    )
  }, [props.setting, agentRarityKey, costTable])

  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setRoundPick(props.roundId, props.side, props.index, null)
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
          <span className="absolute left-0 top-0 h-8 min-w-8 w-fit px-2 flex items-center justify-center bg-content/70 backdrop-blur-lg text-gray-50 font-bold text-lg">
            {totalCost}
          </span>
          <div className="w-full h-full" style={{ backgroundColor: agent.color || 'transparent' }}>
            <img
              className="block w-full"
              src={agent.chzzkSquareImage || agent.labSquareImage}
              alt={agent.nameKo}
            />
          </div>
        </Button>
        <Button
          type="button"
          className="absolute right-0 top-0 group size-8 flex items-center justify-center bg-content/70 backdrop-blur-lg text-gray-50 font-bold text-lg"
          onClick={onDeleteClick}
        >
          <Icons.Cross className="dark:stroke-gray-50 size-6 group-hover:stroke-secondary" />
        </Button>
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CostDialog
          roundId={props.roundId}
          side={props.side}
          agentId={props.agent!}
          index={props.index}
          totalCost={totalCost}
        />
      </Dialog>
    </>
  )
}

export default AgentButton
