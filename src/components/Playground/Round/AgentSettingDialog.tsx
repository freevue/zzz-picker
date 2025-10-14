import { UI } from '@/components'
import { useAgents } from '@/hooks'
import type { CostTable, AgentCostSetting } from '@/types'
import { pipe, find, join, concat } from '@fxts/core'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  id: number
  totalCost: number
  setting: AgentCostSetting
  onSetting: (setting: AgentCostSetting) => void
  onClose: () => void
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

const AgentSettingDialog: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const [setting, setSetting] = useState<AgentCostSetting>(props.setting)
  const agent = useMemo(() => {
    return pipe(
      agents,
      find((agent) => agent.id === props.id)
    )!
  }, [props.id, agents])
  const onRateChange = (value: number, name: string) => {
    setSetting((prev) => ({ ...prev, [name]: value }))
  }
  const onPickupChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget!

    setSetting((prev) => ({
      ...prev,
      pickup: value as keyof CostTable['agent'],
    }))
  }
  const onEngineChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget!

    setSetting((prev) => ({
      ...prev,
      engineType: (value ? value : null) as keyof CostTable['engine'],
    }))
  }

  useEffect(() => {
    if (agent.rarity === 'S') {
      setSetting((prev) => ({ ...prev, pickup: 'SPick' }))
    }
  }, [props.id])
  useEffect(() => {
    props.onSetting(setting)
  }, [setting])

  return (
    <UI.Dialog onClose={props.onClose} className="bg-bg-content border-1 border-secondary">
      <UI.Typo.Heading primary className="p-4 relative">
        {agent.fullName} +{props.totalCost}
        <span className="absolute top-4 right-8 text-7xl font-black italic text-secondary">
          {agent.rarity}
        </span>
      </UI.Typo.Heading>
      <div className="flex mt-10 items-end">
        <div className="w-lg h-lg overflow-hidden flex items-start justify-start">
          <img src={agent.images.header} className="block w-full" alt="" />
        </div>
        <div className="p-8 w-fit">
          <UI.Typo.Heading primary className="text-2xl">
            Cost 설정
          </UI.Typo.Heading>
          <div className="mt-8 flex flex-col gap-8">
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
          </div>
        </div>
      </div>
    </UI.Dialog>
  )
}

export default AgentSettingDialog
