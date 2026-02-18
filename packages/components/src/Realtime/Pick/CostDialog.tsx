import { pipe, join, concat, when, map, toArray, filter, includes, sort } from '@fxts/core'
import { Plus, Cross } from '@zzz-picker/components/icons'
import { Form, Typo, Dialog, Tabs } from '@zzz-picker/components/v2'
import type { AgentCostSetting, Engine, EngineId, Rarity } from '@zzz-picker/constant'
import { useAgent, useEngine, useStore } from '@zzz-picker/provider/hooks'
import { useState } from 'react'

type Props = {
  agentId: number
  costSetting: AgentCostSetting
  onCostChange: (setting: AgentCostSetting) => void
}

/**
 * 엔진 버튼 컴포넌트
 */
type EngineButtonProps = Engine & {
  active?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const EngineButton: React.FC<EngineButtonProps> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      value={props.id}
      className={pipe(
        ['flex', 'flex-col', 'items-center', 'justify-center', 'cursor-pointer'],
        concat(['focus:outline-none', 'group']),
        join(' ')
      )}
    >
      <div className={pipe(['aspect-square', 'min-w-full'], join(' '))}>
        <img
          className={pipe(
            ['block', 'w-full', 'drop-shadow-center'],
            concat(
              props.active
                ? ['drop-shadow-primary']
                : ['drop-shadow-transparent', 'group-hover:drop-shadow-primary']
            ),
            join(' ')
          )}
          src={props.iconUrl}
          alt=""
        />
      </div>
      <span
        className={pipe(['body-sm', 'text-ink', 'line-clamp-1', 'text-center', 'mt-1'], join(' '))}
      >
        {props.nameKo || '-'}
      </span>
    </button>
  )
}

/**
 * 모바일 반응형 엔진 선택 Dialog
 */
type EngineDialogProps = {
  isOpen: boolean
  allowEngines?: EngineId[]
  activeEngine?: EngineId[]
  onClose?: () => void
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const EngineDialog: React.FC<EngineDialogProps> = (props) => {
  const { engines } = useStore()
  const [rarity, setRarity] = useState<Rarity>('S')

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <div className={pipe(['w-full', 'max-w-2xl', 'mx-auto'], join(' '))}>
        {/* 전용무기 섹션 */}
        {props.allowEngines && props.allowEngines.length > 0 && (
          <div className="mb-8">
            <Typo.Heading className="heading-4xl text-primary">Exclusive Engines</Typo.Heading>
            <div
              className={pipe(
                ['grid', 'gap-4', 'items-start', 'mt-4'],
                concat(['grid-cols-3', 'sm:grid-cols-4', 'md:grid-cols-5']),
                join(' ')
              )}
            >
              {pipe(
                props.allowEngines,
                map((engineId) => engines.get(engineId)!),
                filter((engine) => !!engine),
                map((engine) => (
                  <EngineButton
                    onClick={props.onSelect}
                    active={includes(Number(engine.id), props.activeEngine || [])}
                    {...engine}
                    key={Number(engine.id)}
                  />
                )),
                toArray
              )}
            </div>
          </div>
        )}

        {/* 전체 엔진 섹션 */}
        <div>
          <div
            className={pipe(
              ['flex', 'items-center', 'justify-between', 'gap-4'],
              concat(['flex-col', 'sm:flex-row', 'sm:gap-16']),
              join(' ')
            )}
          >
            <Typo.Heading className="heading-4xl text-primary w-full sm:w-auto">
              Engines
            </Typo.Heading>
            <Tabs
              className="w-full sm:w-1/2 sm:ml-auto"
              list={['S', 'A', 'B']}
              value={rarity}
              onChange={(value) => setRarity(value as Rarity)}
            />
          </div>
          <div
            className={pipe(
              ['grid', 'gap-4', 'items-start', 'mt-8'],
              concat(['grid-cols-3', 'sm:grid-cols-4', 'md:grid-cols-5']),
              join(' ')
            )}
          >
            {/* 선택 해제 버튼 */}
            <button
              onClick={props.onSelect}
              className={pipe(
                [
                  'flex',
                  'flex-col',
                  'items-center',
                  'justify-center',
                  'cursor-pointer',
                  'px-4',
                  'h-full',
                ],
                concat(['focus:outline-none', 'group']),
                join(' ')
              )}
            >
              <Cross className="size-full stroke-ink group-hover:stroke-primary" />
            </button>
            {pipe(
              engines,
              filter(([engineId]) => !includes(engineId, props.allowEngines || [])),
              sort(([, engine]) => (engine.isPickup ? -1 : 1)),
              filter(([, engine]) => engine.rank === rarity),
              map(([engineId, engine]) => (
                <EngineButton
                  onClick={props.onSelect}
                  active={includes(engineId, props.activeEngine || [])}
                  {...engine}
                  key={engineId}
                />
              )),
              toArray
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

const CostDialog: React.FC<Props> = (props) => {
  const [isEnginesOpen, setIsEnginesOpen] = useState(false)
  const agent = useAgent(props.agentId)!
  const engine = useEngine(props.costSetting.engineId)

  const onRateChange = (name: 'agentRate' | 'engineRate') => (value: number) => {
    props.onCostChange({
      ...props.costSetting,
      [name]: value,
    })
  }

  const onEngineSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    pipe(
      Number(event.currentTarget.value),
      when(isNaN, () => null),
      (engineId: EngineId | null) => {
        setIsEnginesOpen(false)
        props.onCostChange({
          ...props.costSetting,
          engineId,
        })
      }
    )
  }

  return (
    <>
      <div
        className={pipe(
          ['w-full', 'relative', 'flex', 'flex-col'],
          concat(['sm:w-2xl', 'sm:min-h-[480px]']),
          join(' ')
        )}
      >
        <Typo.Heading className="heading-4xl text-primary" heading={2}>
          {agent.fullNameKo}
          <span
            className="absolute -top-2 -right-2 text-9xl font-black block scale-200 opacity-50 italic"
            style={{ color: agent.color || 'var(--color-secondary)' }}
          >
            {agent.rarity}
          </span>
        </Typo.Heading>
        <div
          className={pipe(
            ['flex', 'mt-8', 'relative', 'z-10', 'flex-1', 'gap-8'],
            concat(['flex-col', 'items-center']),
            concat(['sm:flex-row', 'sm:items-end']),
            join(' ')
          )}
        >
          <div
            className={pipe(
              ['block', 'w-full', 'relative', 'flex', 'items-start', 'justify-start'],
              concat(['w-48', 'sm:w-xs', 'sm:h-full']),
              join(' ')
            )}
          >
            <img
              className={pipe(['w-full', 'block'], join(' '))}
              src={agent.banner.url}
              alt={agent.nameKo}
            />
          </div>
          <div className="flex-1 w-full">
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
                  value={props.costSetting.agentRate}
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
                      'w-32',
                      'sm:w-40',
                      'mx-auto',
                      'bg-base',
                      'rounded-tr-4xl',
                      'rounded-bl-4xl',
                      'relative',
                    ],
                    concat(['focus:outline-none', 'cursor-pointer', 'group']),
                    concat(engine ? ['bg-transparent'] : ['p-4']),
                    join(' ')
                  )}
                  onClick={() => setIsEnginesOpen(true)}
                >
                  {engine ? (
                    <img
                      className={pipe(['block', 'w-full', 'relative'], join(' '))}
                      src={engine.imageUrl}
                      alt=""
                    />
                  ) : (
                    <Plus className="stroke-ink size-full group-hover:stroke-primary" />
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
                  value={props.costSetting.engineRate}
                  name="engineRate"
                  onChange={onRateChange('engineRate')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <EngineDialog
        isOpen={isEnginesOpen}
        allowEngines={pipe(
          agent.engine,
          map((engine) => engine.id),
          toArray
        )}
        activeEngine={props.costSetting.engineId ? [props.costSetting.engineId] : undefined}
        onClose={() => setIsEnginesOpen(false)}
        onSelect={onEngineSelect}
      />
    </>
  )
}

export default CostDialog
