import { useAgent, usePlay } from '@/hooks'
import { pipe, join, concat } from '@fxts/core'
import { Form, Typo, Tabs } from '@zzz-picker/components/v2'
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

  const onRateChange = (name: string) => (value: number) => {
    setCost((prev) => {
      const currentCost = new Map(prev[props.side])

      currentCost.set(props.agentId, { ...currentCost.get(props.agentId)!, [name]: value })

      return { ...prev, [props.side]: currentCost }
    })
  }
  const onEngineChange = (value: string) => {
    setCost((prev) => {
      const currentCost = new Map(prev[props.side])
      currentCost.set(props.agentId, {
        ...currentCost.get(props.agentId)!,
        engineType: value ? (value as EngineCostType) : null,
      })

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
      <Typo.Heading className="heading-4xl text-primary" heading={2}>
        {agent.fullNameKo} +{props.totalCost}
        <span
          className="absolute -top-2 -right-2 text-9xl font-black block scale-200 opacity-50 italic"
          style={{ color: agent.color || 'var(--color-secondary)' }}
        >
          {agent.rarity}
        </span>
      </Typo.Heading>
      <div className="flex mt-8 items-end relative z-10 flex-1 gap-8">
        <div className="w-xs h-full flex items-start justify-start">
          <img
            className={pipe(['w-full', 'block'], concat([]), join(' '))}
            src={agent.banner.url}
            alt={agent.nameKo}
          />
        </div>
        <div className="flex-1">
          <Typo.Heading className="heading-3xl text-primary" heading={3}>
            Cost 설정
          </Typo.Heading>
          <div className="mt-8 flex flex-col gap-8">
            <div>
              <Typo.Body className="body-xl mb-2">캐릭터 돌파</Typo.Body>
              <Form.Count
                min={0}
                max={6}
                step={1}
                value={currentCost.agentRate}
                className="bg-base/70"
                name="agentRate"
                onChange={onRateChange('agentRate')}
              />
            </div>
            <div>
              <Typo.Body className="body-xl mb-2">엔진 종류</Typo.Body>
              <Tabs
                list={[
                  { label: '전용', value: 'sExclusiveEngine' },
                  { label: 'S급', value: 'sEngine' },
                  { label: 'A급', value: 'aEngine' },
                  { label: '미착용', value: '' },
                ]}
                value={currentCost.engineType || ''}
                onChange={onEngineChange}
              />
            </div>
            <div>
              <Typo.Body className="body-xl mb-2">엔진 돌파</Typo.Body>
              <Form.Count
                min={1}
                max={5}
                step={1}
                className="bg-base/70"
                value={currentCost.engineRate}
                name="engineRate"
                onChange={onRateChange('engineRate')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostDialog
