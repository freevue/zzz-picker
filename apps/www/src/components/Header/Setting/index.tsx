import { UI, RarityTabs } from '@/components'
import { useSetting, useStore } from '@/hooks'
import type { Rarity } from '@/types'
import { pipe, map, toArray, filter, includes } from '@fxts/core'
import { Form, Agent } from '@zzz-picker/components'
import { useState } from 'react'

const Setting: React.FC = () => {
  const { setting, setSaveSetting } = useSetting()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')
  const { gqlAgents } = useStore()

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.history.replaceState(null, '', `?allowAgent=${event.currentTarget.value}`)

    // pipe(Number(event.currentTarget.value), (id) => {
    //   setSaveSetting({
    //     ...setting,
    //     allowAgent: includes(id, setting.allowAgent)
    //       ? pipe(
    //           [...setting.allowAgent],
    //           filter((agentId) => agentId !== id),
    //           toArray
    //         )
    //       : [...setting.allowAgent, id],
    //   })
    // })
  }
  const onInputChange = (value: number, name: string) => {
    setSaveSetting({ ...setting, [name]: value })
  }

  return (
    <div className="flex flex-col w-2xl">
      <UI.Typo.Heading primary>설정</UI.Typo.Heading>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex mb-4 items-center text-center gap-8">
          <h2 className="text-2xl w-2/5 font-black dark:text-white">Total Cost</h2>
          <div className="flex-1">
            <Form.Count
              min={0}
              max={30}
              value={setting.totalCost}
              name="totalCost"
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="flex mb-4 items-center text-center gap-8">
          <h2 className="text-2xl w-2/5 font-black dark:text-white">Ban Count</h2>
          <div className="flex-1">
            <Form.Count
              min={0}
              max={5}
              value={setting.banCount}
              name="banCount"
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden gap-4 mt-8">
          <div className="flex items-center justify-between gap-16">
            <UI.Typo.Heading primary>Allow Agent</UI.Typo.Heading>
            <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
          </div>
          <ul className="grid grid-cols-5 py-4 gap-y-4 flex-1">
            {pipe(
              gqlAgents,
              filter(([, agent]) => agent.rarity === selectRarity),
              map(([id, agent]) => (
                <li key={id} className="flex items-start justify-center">
                  <Agent.Card
                    onClick={onAgentClick}
                    disabled={agent.isTeaser}
                    active={includes(id, setting.allowAgent)}
                    {...agent}
                  />
                </li>
              )),
              toArray
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Setting
