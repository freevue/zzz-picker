import Dialog from './'
import { useStore } from '@zzz-picker/provider/hooks'

type Props = {
  isOpen: boolean
  allowAgents?: number[]
  banAgents?: number[]
  onClose?: () => void
  onSelect?: (agentId: number) => void
}

const Agents: React.FC<Props> = (props) => {
  const { agents } = useStore()

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      <div>Agents</div>
    </Dialog>
  )
}

export default Agents
