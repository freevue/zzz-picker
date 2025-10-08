import type { AgentAvatar } from '@/types'
import { getAgentSquareImage } from '@/utils'
import { concat, join, pipe } from '@fxts/core'
import { useMemo } from 'react'

type Props = {
  className?: string
} & AgentAvatar

const Avatar: React.FC<Props> = (props) => {
  const avatarSrc = useMemo(() => getAgentSquareImage(props.id), [props.id])

  return (
    <div
      className={pipe(
        ['flex', 'items-start', 'size-20', 'overflow-hidden'],
        concat(props.className ? [props.className] : []),
        join(' ')
      )}
      draggable={false}
    >
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
