import { Agent, Typo, Tabs } from '../'
import Dialog from './'
import { pipe, map, toArray, filter, includes, sortBy } from '@fxts/core'
import type { AgentId } from '@zzz-picker/constant'
import type { Rarity } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  allowAgents?: AgentId[]
  banAgents?: AgentId[]
  activeAgent?: AgentId[]
  onClose?: () => void
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Agents: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const [rarity, setRarity] = useState<Rarity>('S')

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      {props.allowAgents && (
        <div className="mb-8">
          <Typo.Heading className="heading-4xl text-primary">Allow Agents</Typo.Heading>
          <div className="grid grid-cols-5 gap-4 w-2xl items-start mt-4">
            {pipe(
              props.allowAgents || [],
              map((agentId) => (
                <Agent.Button
                  naming
                  onClick={props.onSelect}
                  active={includes(agentId, props.activeAgent || [])}
                  id={agentId}
                  key={agentId}
                />
              )),
              toArray
            )}
          </div>
        </div>
      )}
      <div>
        <Typo.Heading className="heading-4xl text-primary">Agents</Typo.Heading>
        <div className="mt-4 flex">
          <Tabs
            className="w-1/3 ml-auto"
            list={['S', 'A']}
            value={rarity}
            onChange={(value) => setRarity(value as Rarity)}
          />
        </div>
        <div className="grid grid-cols-5 gap-4 w-2xl items-start mt-8">
          {pipe(
            agents,
            filter(([agentId]) => !includes(agentId, props.allowAgents || [])),
            filter(([, agent]) => agent.rarity === rarity),
            sortBy(([agentId]) => agentId),
            map(([agentId, agent]) => (
              <div key={agentId} className="flex items-center justify-center">
                <Agent.Button
                  naming
                  hover
                  onClick={props.onSelect}
                  active={includes(agentId, props.activeAgent || [])}
                  disabled={includes(agentId, props.banAgents || []) || agent.isTeaser}
                  id={agentId}
                />
              </div>
            )),
            toArray
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default Agents
