import { pipe, join, concat, when, map, toArray } from '@fxts/core'
import { Plus } from '@zzz-picker/components/icons'
import { Form, Typo, Dialog } from '@zzz-picker/components/v2'
import type { SelectAgent, AgentCostSetting } from '@zzz-picker/constant'
import { useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { useMemo, useState } from 'react'

export type PickInfo = {
  agentId: SelectAgent
  engineId: number | null
  agentRate: number
  engineRate: number
}

type Props = {
  pickInfo: PickInfo
  onUpdate: (updates: Partial<PickInfo>) => void
  agent: any
  engine?: any | null
}

export const PlayerPickDialog: React.FC<Props> = ({ pickInfo, onUpdate, agent, engine }) => {
  const [isEnginesOpen, setIsEnginesOpen] = useState(false)
  const { costTable } = useSetting()

  const totalCost = useMemo(() => {
    return getTotalCost(costTable, [pickInfo as unknown as AgentCostSetting, agent, engine])
  }, [costTable, pickInfo, agent, engine])

  const onRateChange = (name: string) => (value: number) => {
    onUpdate({ [name]: value })
  }

  const onEngineSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    pipe(
      Number(event.currentTarget.value),
      when(isNaN, () => null),
      (engineId) => {
        setIsEnginesOpen(false)
        onUpdate({ engineId })
      }
    )
  }

  return (
    <>
      <div
        className={pipe(
          [
            'w-2xl',
            'relative',
            'min-h-[480px]',
            'flex',
            'flex-col',
            'bg-base',
            'rounded-3xl',
            'p-8',
            'shadow-2xl',
            'border',
            'border-ink/10',
          ],
          concat([]),
          join(' ')
        )}
      >
        <Typo.Heading className="heading-4xl text-primary" heading={2}>
          {agent.fullNameKo} +{totalCost}
          <span
            className="absolute -top-2 -right-2 text-9xl font-black block scale-200 opacity-50 italic pointer-events-none"
            style={{ color: agent.color || 'var(--color-secondary)' }}
          >
            {agent.rarity}
          </span>
        </Typo.Heading>
        <div className="flex mt-8 items-end relative z-10 flex-1 gap-8">
          <div
            className={pipe(
              [
                'block',
                'w-full',
                'relative',
                'w-xs',
                'h-full',
                'flex',
                'items-start',
                'justify-start',
              ],
              join(' ')
            )}
          >
            <img
              className={pipe(
                ['w-full', 'block', 'rounded-2xl', 'overflow-hidden'],
                concat([]),
                join(' ')
              )}
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
                  value={pickInfo.agentRate}
                  className="bg-base/70"
                  name="agentRate"
                  onChange={onRateChange('agentRate')}
                />
              </div>
              <div>
                <Typo.Body className="body-xl mb-2">엔진 종류</Typo.Body>
                <button
                  type="button"
                  className={pipe(
                    [
                      'block',
                      'aspect-square',
                      'w-40',
                      'mx-auto',
                      'bg-base',
                      'rounded-tr-4xl',
                      'rounded-bl-4xl',
                      'relative',
                      'border-2',
                      'border-dashed',
                      'border-ink/10',
                    ],
                    concat(['focus:outline-none', 'cursor-pointer', 'group']),
                    concat(engine ? ['bg-transparent border-none'] : ['p-4']),
                    join(' ')
                  )}
                  onClick={() => setIsEnginesOpen(true)}
                >
                  {engine ? (
                    <img
                      className={pipe(['block', 'w-full', 'relative', 'object-contain'], join(' '))}
                      src={engine.imageUrl}
                      alt=""
                    />
                  ) : (
                    <Plus className="stroke-ink size-full group-hover:stroke-primary transition-colors" />
                  )}
                </button>
              </div>
              <div>
                <Typo.Body className="body-xl mb-2">엔진 돌파</Typo.Body>
                <Form.Count
                  min={1}
                  max={5}
                  step={1}
                  className="bg-base/70"
                  value={pickInfo.engineRate}
                  name="engineRate"
                  onChange={onRateChange('engineRate')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog.Engines
        isOpen={isEnginesOpen}
        allowEngines={pipe(
          agent.engine,
          map((engine: any) => engine.id),
          toArray
        )}
        activeEngine={pickInfo.engineId ? [pickInfo.engineId] : undefined}
        onClose={() => setIsEnginesOpen(false)}
        onSelect={onEngineSelect}
      />
    </>
  )
}
