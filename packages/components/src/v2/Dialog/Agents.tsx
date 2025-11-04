import { Agent, Typo } from '../'
import Dialog from './'
import { pipe, map, toArray, filter, includes, sortBy } from '@fxts/core'
import { useStore } from '@zzz-picker/provider/hooks'

type Props = {
  isOpen: boolean
  allowAgents?: number[]
  banAgents?: number[]
  activeAgent?: number[]
  onClose?: () => void
  onSelect?: (agentId: number) => void
}

const Agents: React.FC<Props> = (props) => {
  const { agents } = useStore()

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
        <div className="grid grid-cols-5 gap-4 w-2xl items-start mt-4">
          {pipe(
            agents,
            filter(([agentId]) => !includes(agentId, props.allowAgents || [])),
            sortBy(([agentId]) => agentId),
            map(([agentId, agent]) => (
              <div key={agentId} className="flex items-center justify-center">
                <Agent.Button
                  naming
                  hover
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
