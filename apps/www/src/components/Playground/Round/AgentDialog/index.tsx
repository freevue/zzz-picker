import AgentButton from './AgentButton'
import { RarityTabs } from '@/components'
import { useStore, usePlay, useSetting } from '@/hooks'
import type { Rarity } from '@/types'
import { pipe, filter, map, toArray, includes } from '@fxts/core'
import { Typo } from '@zzz-picker/components'
import { useState } from 'react'

type Props = {
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
        <Typo.Heading primary>Allow Agent</Typo.Heading>
      </div>
      <div className="flex-1 mt-8">
        <ul className="grid grid-cols-5 gap-4 py-4 flex-1">
          {pipe(
            agent,
            filter(([id]) => includes(id, setting.allowAgent)),
            map(([id]) => (
              <li key={id} className="flex items-start justify-center">
                <AgentButton id={id} active={false} onClick={props.onClick} disabled={false} />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-16 mt-8">
        <Typo.Heading primary>Select Agent</Typo.Heading>
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
                  active={false}
                  onClick={props.onClick}
                  disabled={includes(id, banList)}
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
