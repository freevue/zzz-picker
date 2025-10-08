import { UI, RarityTabs, Agent } from '@/components'
import { useAgents } from '@/hooks'
import { pipe, filter, map, toArray } from '@fxts/core'
import { useState } from 'react'

type Props = {
  onClose: () => void
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AgentDialog: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const [selectRarity, setSelectRarity] = useState<'S' | 'A'>('S')

  return (
    <UI.Dialog onClose={props.onClose} className="w-xl h-3/4 overflow-hidden bg-base">
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl flex-1 font-black dark:text-white italic">선택</h2>
          <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
        </div>
        <ul className="grid grid-cols-5 gap-4 py-4 flex-1 overflow-y-auto scrollbar-hidden">
          {pipe(
            agents,
            filter((agent) => agent.avatar.rarity === selectRarity),
            map((agent) => (
              <li key={agent.avatar.id} className="flex items-start justify-center">
                <Agent.Button
                  onClick={props.onClick}
                  disabled={agent.is_teaser}
                  {...agent.avatar}
                />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
    </UI.Dialog>
  )
}

export default AgentDialog
