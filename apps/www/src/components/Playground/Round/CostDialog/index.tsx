import { UI } from '@/components'
import { PRETTY_AGENT_ID } from '@/constant'
import { useAgent, usePlay } from '@/hooks'
import { pipe, join, concat, map, zipWithIndex, toArray } from '@fxts/core'
import { Form, Button } from '@zzz-picker/components'
import type { Side, TypeEngine } from '@zzz-picker/provider'
import { useMemo } from 'react'

type Props = {
  roundId: number
  side: Side
  agentId: number
  index: number
  totalCost: number
}

const CostDialog: React.FC<Props> = (props) => {
  const agent = useAgent(props.agentId)!
  const { round, setRoundCostSetting } = usePlay()
  const currentCost = useMemo(() => {
    return pipe(
      round.get(props.roundId)!,
      (round) => round[props.side].pickList[props.index].setting
    )
  }, [round, props.roundId, props.side, props.index])

  const onRateChange = (value: number, name: string) => {
    setRoundCostSetting(props.roundId, props.side, props.index, { ...currentCost, [name]: value })
  }
  const onEngineChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const engineType = (event.currentTarget.value || null) as TypeEngine | null

    setRoundCostSetting(props.roundId, props.side, props.index, { ...currentCost, engineType })
  }

  return (
    <div className={pipe(['w-2xl', 'relative'], concat([]), join(' '))}>
      <UI.Typo.Heading primary className="">
        {agent.fullNameKo} +{props.totalCost}
        <span
          className="absolute -top-2 -right-2 text-9xl font-black block scale-200 opacity-50 italic"
          style={{ color: agent.color || 'var(--color-secondary)' }}
        >
          {agent.rarity}
        </span>
      </UI.Typo.Heading>
      <div className="flex mt-8 items-end relative z-10">
        <div className="w-sm flex items-start justify-start">
          <img
            className={pipe(
              ['w-full', 'block'],
              concat(
                props.agentId === PRETTY_AGENT_ID
                  ? ['fill-white', 'drop-shadow-xl', 'drop-shadow-white']
                  : []
              ),
              join(' ')
            )}
            src={agent.zzzBannerImage}
            alt={agent.nameKo}
          />
        </div>
        <div className="flex-1">
          <UI.Typo.Heading primary className="text-2xl">
            Cost 설정
          </UI.Typo.Heading>
          <div className="mt-8 flex flex-col gap-8">
            <div>
              <UI.Typo.Heading className="text-xl mb-2">캐릭터 돌파</UI.Typo.Heading>
              <Form.Count
                min={0}
                max={6}
                step={1}
                value={currentCost.rate}
                name="rate"
                onChange={onRateChange}
              />
            </div>
            <div>
              <UI.Typo.Heading className="text-xl mb-2">엔진 종류</UI.Typo.Heading>
              <ul className={pipe(['flex', 'rounded-lg', 'overflow-hidden'], join(' '))}>
                {pipe(
                  [
                    { name: '전용', value: 'SExclusive' },
                    { name: 'S급', value: 'S' },
                    { name: 'A급', value: 'A' },
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
                              : [
                                  'dark:text-gray-50',
                                  'dark:bg-gray-600/70',
                                  'dark:hover:bg-gray-600',
                                ]
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
            {currentCost.engineType && (
              <div>
                <UI.Typo.Heading className="text-xl mb-2">엔진 돌파</UI.Typo.Heading>
                <Form.Count
                  min={0}
                  max={5}
                  step={1}
                  value={currentCost.engineRate}
                  name="engineRate"
                  onChange={onRateChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostDialog
