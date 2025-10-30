import { useAgent, usePlay } from '@/hooks'
import { pipe, join, concat, map, zipWithIndex, toArray } from '@fxts/core'
import { Form, Button, Typo } from '@zzz-picker/components'
import { PRETTY_AGENT_ID } from '@zzz-picker/constant'
import type { Side, RoundId, EngineCostType } from '@zzz-picker/constant'
import { useMemo } from 'react'

type Props = {
  roundId: RoundId
  side: Side
  agentId: number
  totalCost: number
}

const CostDialog: React.FC<Props> = (props) => {
  const agent = useAgent(props.agentId)!
  const { cost, setCost } = usePlay()
  const currentCost = useMemo(
    () => cost[props.side].get(props.agentId)!,
    [cost, props.agentId, props.side]
  )

  const onRateChange = (value: number, name: string) => {
    setCost((prev) => {
      const currentCost = new Map(prev[props.side])

      currentCost.set(props.agentId, { ...currentCost.get(props.agentId)!, [name]: value })

      return { ...prev, [props.side]: currentCost }
    })
  }
  const onEngineChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const engineType = (event.currentTarget.value || null) as EngineCostType | null

    setCost((prev) => {
      const currentCost = new Map(prev[props.side])

      currentCost.set(props.agentId, { ...currentCost.get(props.agentId)!, engineType })

      return { ...prev, [props.side]: currentCost }
    })
  }

  return (
    <div
      className={pipe(
        ['w-2xl', 'relative', 'min-h-[480px]', 'flex', 'flex-col'],
        concat([]),
        join(' ')
      )}
    >
      <Typo.Heading primary className="">
        {agent.fullNameKo} +{props.totalCost}
        <span
          className="absolute -top-2 -right-2 text-9xl font-black block scale-200 opacity-50 italic"
          style={{ color: agent.color || 'var(--color-secondary)' }}
        >
          {agent.rarity}
        </span>
      </Typo.Heading>
      <div className="flex mt-8 items-end relative z-10 flex-1 gap-8">
        <div className="w-sm flex items-start justify-start">
          <img
            className={pipe(
              ['w-full', 'block'],
              concat([]),
              concat(
                props.agentId === PRETTY_AGENT_ID
                  ? // ? ['fill-white', 'drop-shadow-2xl', 'drop-shadow-white']
                    ['rounded-bl-2xl', 'rounded-tr-2xl', 'border-2', 'border-secondary']
                  : []
              ),
              join(' ')
            )}
            src={agent.banner.url}
            alt={agent.nameKo}
          />
        </div>
        <div className="flex-1">
          <Typo.Heading primary className="text-2xl">
            Cost 설정
          </Typo.Heading>
          <div className="mt-8 flex flex-col gap-8">
            <div>
              <Typo.Heading className="text-xl mb-2">캐릭터 돌파</Typo.Heading>
              <Form.Count
                min={0}
                max={6}
                step={1}
                value={currentCost.agentRate}
                name="agentRate"
                onChange={onRateChange}
              />
            </div>
            <div>
              <Typo.Heading className="text-xl mb-2">엔진 종류</Typo.Heading>
              <ul className={pipe(['flex', 'rounded-lg', 'overflow-hidden'], join(' '))}>
                {pipe(
                  [
                    { name: '전용', value: 'sExclusiveEngine' },
                    { name: 'S급', value: 'sEngine' },
                    { name: 'A급', value: 'aEngine' },
                    { name: '미착용', value: null },
                  ],
                  zipWithIndex,
                  map(([index, item]) => (
                    <li key={index} className="flex-1">
                      <Button
                        className={pipe(
                          ['w-full', 'py-1', 'font-extrabold', 'text-lg'],
                          concat(
                            currentCost.engineType === item.value
                              ? ['bg-primary']
                              : ['text-foreground', 'bg-gray-600/70', 'hover:bg-gray-600']
                          ),
                          join(' ')
                        )}
                        type="button"
                        onClick={onEngineChange}
                        value={item.value || ''}
                      >
                        {item.name}
                      </Button>
                    </li>
                  )),
                  toArray
                )}
              </ul>
            </div>
            <div>
              <Typo.Heading className="text-xl mb-2">엔진 돌파</Typo.Heading>
              <Form.Count
                min={1}
                max={5}
                step={1}
                value={currentCost.engineRate}
                name="engineRate"
                onChange={onRateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostDialog
