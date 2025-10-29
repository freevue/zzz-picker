import { RarityTabs } from '@/components'
import { useStore, usePlay, useSetting } from '@/hooks'
import { pipe, filter, map, toArray, includes } from '@fxts/core'
import { Typo, Agent } from '@zzz-picker/components'
import type { Rarity } from '@zzz-picker/constant'
import { useState } from 'react'

type Props = {
  onClose: () => void
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AgentDialog: React.FC<Props> = (props) => {
  const { gqlAgents } = useStore()
  const { state: playState } = usePlay()
  const { state: settingState } = useSetting()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')

  return (
    <div className="flex flex-col w-2xl">
      <div className="flex items-center justify-between gap-16">
        <Typo.Heading primary>Ban Agent</Typo.Heading>
        <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
      </div>
      <div className="flex-1 mt-8">
        <ul className="grid grid-cols-5 gap-4 py-4 flex-1">
          {pipe(
            gqlAgents,
            filter(([, agent]) => !agent.isTeaser),
            filter(([, agent]) => agent.rarity === selectRarity),
            filter(([id]) => !includes(id, settingState.allowAgent)),
            map(([id, agent]) => (
              <li key={id} className="flex items-start justify-center">
                <Agent.Card
                  active={includes(id, playState.banList)}
                  onClick={props.onClick}
                  {...agent}
                />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
    </div>
  )
}

export default AgentDialog
