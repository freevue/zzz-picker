import { RarityTabs } from '@/components'
import { useRouter, useSetting, useStore } from '@/hooks'
import { pipe, map, toArray, filter, includes, when, concat, reverse } from '@fxts/core'
import { Form, Agent, Typo } from '@zzz-picker/components'
import type { Rarity } from '@zzz-picker/constant'
import { useState } from 'react'

const Setting: React.FC = () => {
  const { path } = useRouter()
  const { state, setState } = useSetting()
  const { gqlAgents } = useStore()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')

  const onAgentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = Number(event.currentTarget.value)

    pipe(
      state.allowAgent,
      when(includes(currentValue), () => filter((id) => id !== currentValue, state.allowAgent)),
      reverse,
      concat(event.currentTarget.checked ? [currentValue] : []),
      reverse,
      toArray,
      (allowAgent) => {
        setState((prev) => ({ ...prev, allowAgent }))
      }
    )
  }
  const onInputChange = (value: number, name: string) => {
    setState((prev) => ({ ...prev, [name]: value }))
  }
  const onThemeChange = () => {
    document.documentElement.classList.toggle('dark')
    document.documentElement.classList.toggle('alice')
  }

  return (
    <div className="flex flex-col w-2xl">
      <Typo.Heading primary className="flex items-center">
        설정
        <button
          type="button"
          onClick={onThemeChange}
          className="ml-auto cursor-pointer px-2 py-1 bg-[#debe8d] text-[#9a3412] rounded-lg text-sm"
        >
          대칭
        </button>
      </Typo.Heading>
      {path === '/unlimited' ? (
        <div className="overflow-hidden rounded-4xl mt-4">
          <img src="/images/bg.jpg" alt="" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-8">
          {state.totalCost !== Infinity && (
            <div className="flex mb-4 items-center text-center gap-8">
              <h2 className="text-2xl w-2/5 font-black text-white">Total Cost</h2>
              <div className="flex-1">
                <Form.Count
                  min={0}
                  max={30}
                  value={state.totalCost}
                  name="totalCost"
                  onChange={onInputChange}
                />
              </div>
            </div>
          )}
          <div className="flex mb-4 items-center text-center gap-8">
            <h2 className="text-2xl w-2/5 font-black text-white">Ban Count</h2>
            <div className="flex-1">
              <Form.Count
                min={0}
                max={5}
                value={state.banCount}
                name="banCount"
                onChange={onInputChange}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden gap-4 mt-8">
            <div className="flex items-center justify-between gap-16">
              <Typo.Heading primary>Allow Agent</Typo.Heading>
              <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
            </div>
            <ul className="grid grid-cols-5 py-4 gap-4 flex-1">
              {pipe(
                gqlAgents,
                filter(([, agent]) => agent.rarity === selectRarity),
                map(([id, agent]) => (
                  <li key={id} className="flex flex-1 items-start justify-center">
                    <Agent.Checkbox
                      disabled={agent.isTeaser}
                      defaultChecked={includes(id, state.allowAgent)}
                      onChange={onAgentChange}
                      {...agent}
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
