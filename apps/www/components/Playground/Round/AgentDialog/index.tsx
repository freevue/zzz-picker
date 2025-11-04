import { RarityTabs } from '@/components'
import { useStore, usePlay, useSetting } from '@/hooks'
import type { Rarity } from '@/types'
import { pipe, filter, map, toArray, includes } from '@fxts/core'
import { Typo, Agent } from '@zzz-picker/components'
import type { RoundId, Side } from '@zzz-picker/constant'
import { useState } from 'react'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  side: Side
  roundId: RoundId
}

const AgentDialog: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const { state: playState } = usePlay()
  const { state: settingState } = useSetting()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')

  return (
    <div className="flex flex-col w-2xl">
      <div className="flex items-center justify-between gap-16">
        <Typo.Heading primary>Allow Agent</Typo.Heading>
      </div>
      <div className="flex-1 mt-8">
        <ul className="grid grid-cols-5 gap-4 py-4 flex-1">
          {pipe(
            agents,
            filter(([id]) => includes(id, settingState.allowAgent)),
            map(([id, agent]) => (
              <li key={id} className="flex items-start justify-center">
                <Agent.Card {...agent} active={false} onClick={props.onClick} disabled={false} />
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
            agents,
            filter(([, agent]) => !agent.isTeaser),
            filter(([, agent]) => agent.rarity === selectRarity),
            filter(([id]) => !includes(id, settingState.allowAgent)),
            map(([id, agent]) => (
              <li key={id} className="flex items-start justify-center">
                <Agent.Card
                  {...agent}
                  active={false}
                  disabled={
                    includes(id, playState.banList) ||
                    includes(
                      id,
                      playState[props.roundId === 'common' ? 'personal' : 'common'][props.side]
                        .pickList
                    )
                  }
                  onClick={props.onClick}
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
