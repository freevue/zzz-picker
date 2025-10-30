import AgentDialog from '../AgentDialog'
import { Plus } from '@/Icons'
import { usePlay, useStore } from '@/hooks'
import type { Side } from '@/types'
import { concat, findIndex, join, pipe } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import type { RoundId } from '@zzz-picker/constant'
import { getAgentRarity } from '@zzz-picker/utils'
import { useState } from 'react'

type Props = {
  side: Side
  index: number
  roundId: RoundId
}

const PickButton: React.FC<Props> = (props) => {
  const { gqlAgents } = useStore()
  const { setState, setCost } = usePlay()
  const [isOpen, setIsOpen] = useState(false)

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const currentAgentId = Number(event.currentTarget.value)

    setState((prev) => {
      const pickList = [...prev[props.roundId][props.side].pickList]
      const currentIndex = findIndex(
        (id) => id === currentAgentId,
        prev[props.roundId][props.side].pickList
      )

      if (currentIndex !== props.index) {
        pickList[props.index] = currentAgentId
        pickList[currentIndex] = null
      }

      return {
        ...prev,
        [props.roundId]: {
          ...prev[props.roundId],
          [props.side]: { ...prev[props.roundId][props.side], pickList },
        },
      }
    })
    pipe(
      currentAgentId,
      (agentId) => gqlAgents.get(agentId)!,
      getAgentRarity,
      (rarity) => ({
        rarity,
        agentRate: 0,
        engineType: null,
        engineRate: 1,
      }),
      (agentSetting) => {
        setIsOpen(false)
        setCost((prev) => {
          const newCost = { ...prev }

          if (newCost[props.side].has(currentAgentId)) return prev

          newCost[props.side].set(currentAgentId, agentSetting)

          return newCost
        })
      }
    )
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          [
            'w-full',
            'h-full',
            'flex',
            'border-2',
            'border-foreground',
            'items-center',
            'justify-center',
            'group/button',
            'border-r-1',
            'border-l-1',
            'group-first/list:border-l-2',
            'group-last/list:border-r-2',
            'backdrop-blur-2xl',
          ],
          concat(
            props.side === 'A'
              ? ['group-first/list:rounded-bl-2xl', 'group-last/list:rounded-tr-2xl']
              : ['group-last/list:rounded-br-2xl', 'group-first/list:rounded-tl-2xl']
          ),
          join(' ')
        )}
      >
        <Plus className="size-12 stroke-foreground group-hover/button:stroke-secondary" />
      </Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AgentDialog onClick={onAgentClick} side={props.side} roundId={props.roundId} />
      </Dialog>
    </>
  )
}

export default PickButton
