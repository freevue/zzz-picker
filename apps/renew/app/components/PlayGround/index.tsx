import Ban from './Ban'
import Boss from './Boss'
import Pick from './Pick'
import { includes } from '@fxts/core'
import { Phase } from '~/constant'
import { useMatchState } from '~/hooks'

type Props = {}

const Play: React.FC<Props> = () => {
  const matchState = useMatchState()

  return (
    <>
      <h1 className="text-7xl font-bold text-primary ft-ria fixed left-4 top-4 z-1">
        {matchState.player?.name} {matchState.player?.role}
      </h1>

      {matchState.phase === Phase.COMMON_BOSS_SELECT && <Boss />}
      {includes(matchState.phase, [Phase.BAN, Phase.BAN_FIX]) && <Ban />}
      {matchState.phase === Phase.PICK && <Pick />}
    </>
  )
}

export default Play
