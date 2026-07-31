import Ban from './Ban'
import Boss from './Boss'
import Pick from './Pick'
import { includes } from '@fxts/core'
import { Phase } from '~/constant'
import { useMatch } from '~/hooks'
import { PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
}

const Play: React.FC<Props> = (props) => {
  const { currentPlay, match } = useMatch()

  return (
    <>
      <h1 className="text-4xl font-bold text-primary ft-ria fixed left-4 top-4 z-10">
        {currentPlay!.name}
      </h1>
      {match.phase === Phase.COMMON_BOSS_SELECT && <Boss role={props.role} />}
      {includes(match.phase, [Phase.BAN, Phase.BAN_FIX]) && <Ban role={props.role} />}
      {match.phase === Phase.PICK && <Pick role={props.role} />}
    </>
  )
}

export default Play
