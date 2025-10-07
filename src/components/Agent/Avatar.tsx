import type { AgentAvatar } from '../../types'
import { getAgentSquareImage } from '../../utils'
import { useMemo } from 'react'

type Props = {} & AgentAvatar

const Avatar: React.FC<Props> = (props) => {
  const avatarSrc = useMemo(() => getAgentSquareImage(props.id), [props.id])

  return (
    <div className="flex items-start size-20 overflow-hidden" draggable={false}>
      <img
        className="block w-full select-none"
        draggable={false}
        src={avatarSrc}
        alt={props.name_mi18n}
      />
    </div>
  )
}

export default Avatar
