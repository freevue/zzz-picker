import AgentButton from './AgentButton'
import { UI, RarityTabs } from '@/components'
import { useStore, usePlay, useSetting } from '@/hooks'
import type { Rarity } from '@/types'
import { pipe, filter, map, toArray, includes } from '@fxts/core'
import { useState } from 'react'

type Props = {
  onClose: () => void
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AgentDialog: React.FC<Props> = (props) => {
  const { agent } = useStore()
  const { banList } = usePlay()
  const { setting } = useSetting()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')

  return (
    <div className="flex flex-col w-2xl">
      <div className="flex items-center justify-between gap-16">
        <UI.Typo.Heading primary>Ban Agent</UI.Typo.Heading>
        <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
      </div>
      <div className="flex-1 mt-8">
        <ul className="grid grid-cols-5 gap-4 py-4 flex-1">
          {pipe(
            agent,
            filter(([, agent]) => !agent.isTeaser),
            filter(([, agent]) => agent.rarity === selectRarity),
            filter(([id]) => !includes(id, setting.allowAgent)),
            map(([id]) => (
              <li key={id} className="flex items-start justify-center">
                <AgentButton
                  id={id}
                  active={includes(id, banList)}
                  onClick={props.onClick}
                  disabled={false}
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
