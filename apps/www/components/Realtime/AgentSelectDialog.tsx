import { Dialog } from '@zzz-picker/components/v2'
import type { AgentId } from '@zzz-picker/constant'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (agentId: AgentId) => void
  selectedAgentId?: AgentId | null
  disabledAgents?: AgentId[]
  filterAgents?: AgentId[]
}

const AgentSelectDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  selectedAgentId,
  disabledAgents,
  filterAgents,
}) => {
  const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = Number(event.currentTarget.value)
    if (!isNaN(value)) {
      onSelect(value as AgentId)
      onClose()
    }
  }

  return (
    <Dialog.Agents
      isOpen={isOpen}
      onClose={onClose}
      onSelect={handleSelect}
      activeAgent={selectedAgentId ? [selectedAgentId] : undefined}
      banAgents={disabledAgents}
      filterAgents={filterAgents}
    />
  )
}

export default AgentSelectDialog
