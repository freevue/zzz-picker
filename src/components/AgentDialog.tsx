import { UI, Agent } from '@/components'

type Props = {
  onClose: () => void
  onChange: (id: number) => void
}

const AgentDialog: React.FC<Props> = (props) => {
  const onSelect = (id: number) => {
    props.onChange(id)
  }

  return (
    <UI.Dialog onClose={props.onClose} className="w-md h-3/4 overflow-hidden bg-base">
      <Agent.List onClick={onSelect} />
    </UI.Dialog>
  )
}

export default AgentDialog
