import { Player } from '~/type'
import Ban from './Ban'
import Boss from './Boss'
import { filter, map, pipe, sort, toArray } from '@fxts/core'
import { useMatchState, useStore } from '~/hooks'
import { MatchType, Phase } from '~/constant'

type Props = {
  player: Player
}

const Player: React.FC<Props> = (props) => {
  const store = useStore()
  const matchState = useMatchState()

  if (matchState.phase === Phase.COMMON_BOSS_SELECT) return <Boss player={props.player} />
  if (matchState.phase === Phase.BAN) return <Ban player={props.player} />

  return <>Hello World</>
}

export default Player
