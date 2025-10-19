import { UI, RarityTabs, Agent } from '@/components'
import { useAgents, useBan } from '@/hooks'
import { useSetting } from '@/hooks'
import { pipe, filter, map, toArray, includes } from '@fxts/core'
import { useState } from 'react'

type Props = {
  onClose: () => void
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AgentDialog: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const { banList } = useBan()
  const { state } = useSetting()
  const [selectRarity, setSelectRarity] = useState<'S' | 'A'>('S')

  return (
    <UI.Dialog
      onClose={props.onClose}
      className="bg-bg-content border-1 border-secondary flex flex-col w-2xl"
    >
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 gap-4">
        <div className="flex items-center justify-between gap-16">
          <UI.Typo.Heading primary>Agent List</UI.Typo.Heading>
          <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
        </div>
        <div className="flex-1">
          <ul className="grid grid-cols-5 gap-4 py-4">
            {pipe(
              agents,
              filter((agent) => agent.rarity === selectRarity),
              filter((agent) => !includes(agent.id, state.allowAgent)),
              map((agent) => (
                <li key={agent.id} className="flex items-start justify-center">
                  <Agent.Button
                    onClick={props.onClick}
                    disabled={agent.isTeaser || includes(agent.id, banList)}
                    {...agent}
                  />
                </li>
              )),
              toArray
            )}
          </ul>
        </div>
      </div>
    </UI.Dialog>
  )
}

export default AgentDialog
