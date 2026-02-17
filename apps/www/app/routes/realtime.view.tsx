import {
  GAME_TYPE,
  DEFAULT_PLAY_STATE,
  DEFAULT_REALTIME_STATE,
  ROOM_PHASE,
  BAN_PHASE,
} from '@zzz-picker/constant'
import { Phase } from '~/components'

const RealtimeView: React.FC = () => {
  return (
    <Phase
      role="A"
      id="1"
      gameType={GAME_TYPE.ORIGINAL}
      initialRoom={{
        play: {
          ...DEFAULT_PLAY_STATE,
          common: { ...DEFAULT_PLAY_STATE.common, boss: 7 },
          banList: [155659, 127403],
        },
        realtime: {
          ...DEFAULT_REALTIME_STATE,
          phase: ROOM_PHASE.PICK,
          banPhase: BAN_PHASE.END,
          banCandidates: [],
        },
      }}
    />
  )
}

export default RealtimeView
