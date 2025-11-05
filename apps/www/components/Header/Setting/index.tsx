import { pipe, map, toArray, filter, includes, when, concat, reverse } from '@fxts/core'
import { useLocation } from '@remix-run/react'
import { Typo, Agent, Tabs, Form } from '@zzz-picker/components/v2'
import type { Rarity } from '@zzz-picker/constant'
import { useSetting, useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useState } from 'react'

const Setting: React.FC = () => {
  const { pathname } = useLocation()
  const { state, setState } = useSetting()
  const { agents } = useStore()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')
  const [selectTheme, setSelectTheme] = useState<'v2' | 'alice'>('v2')

  const onAgentChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentValue = Number(event.currentTarget.value)

    pipe(
      state.allowAgent,
      when(includes(currentValue), () => filter((id) => id !== currentValue, state.allowAgent)),
      reverse,
      concat(includes(currentValue, state.allowAgent) ? [] : [currentValue]),
      reverse,
      toArray,
      (allowAgent) => {
        setState((prev) => ({ ...prev, allowAgent }))
      }
    )
  }
  const onInputChange = (name: string) => (value: number) => {
    setState((prev) => ({ ...prev, [name]: value }))
  }
  const onThemeChange = (value: string) => {
    document.documentElement.className = value
    setSelectTheme(value as 'v2' | 'alice')
  }
  const onRarityChange = (value: string) => {
    setSelectRarity(value as Rarity)
  }

  useEffect(() => {
    if (document.documentElement.className === '') {
      document.documentElement.className = 'v2'
      setSelectTheme('v2')
    } else {
      setSelectTheme(document.documentElement.className === 'alice' ? 'alice' : 'v2')
    }
  }, [])

  return (
    <div className="flex flex-col w-2xl">
      <Typo.Heading className="heading-4xl text-primary" heading={2}>
        Setting
      </Typo.Heading>
      {pathname === '/unlimited' ? (
        <div className="overflow-hidden rounded-4xl mt-4">
          <img src="/images/bg.jpg" alt="" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex mb-4 items-center text-center gap-8">
            <Typo.Heading className="heading-2xl w-1/3" heading={3}>
              Theme
            </Typo.Heading>
            <div className="w-1/2 ml-auto">
              <Tabs
                list={[
                  { label: 'Default', value: 'v2' },
                  { label: 'Alice', value: 'alice' },
                ]}
                className="w-full"
                value={selectTheme}
                onChange={onThemeChange}
              />
            </div>
          </div>
          {state.totalCost !== Infinity && (
            <div className="flex mb-4 items-center text-center gap-8">
              <Typo.Heading className="heading-2xl w-1/3" heading={3}>
                Total Cost
              </Typo.Heading>
              <div className="w-1/2 ml-auto">
                <Form.Count
                  min={0}
                  max={30}
                  value={state.totalCost}
                  name="totalCost"
                  onChange={onInputChange('totalCost')}
                  className="bg-base/70"
                />
              </div>
            </div>
          )}
          <div className="flex mb-4 items-center text-center gap-8">
            <Typo.Heading className="heading-2xl w-1/3" heading={3}>
              Ban Count
            </Typo.Heading>
            <div className="w-1/2 ml-auto">
              <Form.Count
                min={0}
                max={5}
                className="bg-base/70"
                value={state.banCount}
                name="banCount"
                onChange={onInputChange('banCount')}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden gap-4 mt-8">
            <div className="flex items-center justify-between gap-16">
              <Typo.Heading className="heading-4xl text-primary" heading={2}>
                Allow Agent
              </Typo.Heading>
              <Tabs
                list={['S', 'A']}
                className="w-1/2 ml-auto"
                value={selectRarity}
                onChange={onRarityChange}
              />
            </div>
            <ul className="grid grid-cols-5 py-4 gap-4 flex-1">
              {pipe(
                agents,
                filter(([, agent]) => agent.rarity === selectRarity),
                map(([id, agent]) => (
                  <li key={id} className="flex flex-1 items-start justify-center">
                    <Agent.Button
                      naming
                      hover
                      onClick={onAgentChange}
                      active={includes(id, state.allowAgent)}
                      id={id}
                      disabled={agent.isTeaser}
                    />
                  </li>
                )),
                toArray
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Setting
