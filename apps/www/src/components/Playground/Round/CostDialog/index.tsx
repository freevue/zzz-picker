import { UI } from '@/components'
import { PRETTY_AGENT_ID } from '@/constant'
import { useAgent } from '@/hooks'
import type { CostTable, AgentCostSetting } from '@/types'
import { pipe, find, join, concat } from '@fxts/core'
import type { Side } from '@zzz-picker/provider'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  roundId: number
  side: Side
  agentId: number
}

const TabButton: React.FC<{
  children: React.ReactNode
  active: boolean
  value?: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = (props) => {
  return (
    <button
      type="button"
      value={props.value}
      onClick={props.onClick}
      className={pipe(
        [
          'cursor-pointer',
          'px-4',
          'py-2',
          'text-lg',
          'border-2',
          'w-full',
          'min-w-fit',
          'font-bold',
        ],
        concat(
          props.active
            ? ['bg-primary', 'border-primary', 'text-bg-content']
            : [
                'bg-transparent',
                'border-text-primary',
                'text-text-primary',
                'hover:border-secondary',
                'hover:text-secondary',
              ]
        ),
        join(' ')
      )}
    >
      {props.children}
    </button>
  )
}

const CostDialog: React.FC<Props> = (props) => {
  const agent = useAgent(props.agentId)!
  const [setting, setSetting] = useState<AgentCostSetting>({
    pickup: 'SPick',
    agentRate: 0,
    engineType: null,
    engineRate: 0,
  })

  const onRateChange = (value: number, name: string) => {}
  const onPickupChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget!
  }
  const onEngineChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget!
  }

  return (
    <div className={pipe(['w-2xl'], concat([]), join(' '))}>
      <UI.Typo.Heading primary className="p-4 relative">
        {agent.fullNameKo} +
        <span className="absolute top-4 right-8 text-7xl font-black italic text-secondary">
          {agent.rarity}
        </span>
      </UI.Typo.Heading>
      <div className="flex mt-8 items-end">
        <div className="w-sm aspect-square overflow-hidden flex items-start justify-start">
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
        <div className="p-8 w-fit">
          <UI.Typo.Heading primary className="text-2xl">
            Cost 설정
          </UI.Typo.Heading>
          {/* <div className="mt-8 flex flex-col gap-8">
            {agent.rarity === 'S' && (
              <div>
                <UI.Typo.Heading className="text-xl mb-2">등급 종류</UI.Typo.Heading>
                <ul className="flex">
                  <li className="flex-1">
                    <TabButton
                      active={setting.pickup === 'SPick'}
                      value="SPick"
                      onClick={onPickupChange}
                    >
                      픽업
                    </TabButton>
                  </li>
                  <li className="flex-1">
                    <TabButton
                      active={setting.pickup === 'SAlways'}
                      value="SAlways"
                      onClick={onPickupChange}
                    >
                      상시
                    </TabButton>
                  </li>
                </ul>
                <p className="text-xs text-text-muted mt-2">
                  아직 해당 데이터를 구하지 못했습니다.. (추가 예정)
                </p>
              </div>
            )}
            <div>
              <UI.Typo.Heading className="text-xl mb-2">캐릭터 돌파</UI.Typo.Heading>
              <UI.Count
                min={0}
                max={6}
                step={1}
                defaultValue={setting.agentRate}
                name="agentRate"
                onChange={onRateChange}
              />
            </div>
            <div>
              <UI.Typo.Heading className="text-xl mb-2">엔진 종류</UI.Typo.Heading>
              <ul className="flex">
                <li className="flex-1 min-w-fit">
                  <TabButton
                    active={setting.engineType === 'SExclusive'}
                    value="SExclusive"
                    onClick={onEngineChange}
                  >
                    전용
                  </TabButton>
                </li>
                <li className="flex-1 min-w-fit">
                  <TabButton active={setting.engineType === 'S'} value="S" onClick={onEngineChange}>
                    S급
                  </TabButton>
                </li>
                <li className="flex-1 min-w-fit">
                  <TabButton active={setting.engineType === 'A'} value="A" onClick={onEngineChange}>
                    A급
                  </TabButton>
                </li>
                <li className="flex-1 min-w-fit">
                  <TabButton active={setting.engineType === null} onClick={onEngineChange}>
                    미착용
                  </TabButton>
                </li>
              </ul>
            </div>
            {setting.engineType && (
              <div>
                <UI.Typo.Heading className="text-xl mb-2">엔진 돌파</UI.Typo.Heading>
                <UI.Count
                  min={0}
                  max={6}
                  step={1}
                  defaultValue={setting.engineRate}
                  name="engineRate"
                  onChange={onRateChange}
                />
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default CostDialog
