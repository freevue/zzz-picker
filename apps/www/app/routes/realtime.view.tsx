import { DEFAULT_REALTIME_STATE, BAN_PHASE } from '@zzz-picker/constant'
import Provider from '@zzz-picker/provider/store'
import { useState } from 'react'
import type { RoomData } from '~/components/Phase'
import { ROOM_PHASE } from '~/components/Phase'
import ParticipantPhase from '~/components/Phase/Participant'

const RealtimeView: React.FC = () => {
  const [room, setRoom] = useState<RoomData>({
    id: 'mock-room-id',
    game_type: 'common',
    names: { A: 'Player A', B: 'Player B' },
    users: [
      { id: 'user-a', role: 'A', nickname: 'Player A' },
      { id: 'user-b', role: 'B', nickname: 'Player B' },
    ],
    state: {
      ...DEFAULT_REALTIME_STATE,
      realtime: {
        ...DEFAULT_REALTIME_STATE.realtime,
        phase: ROOM_PHASE.BOSS_SELECT,
        banPhase: null,
        banCandidates: [null, null],
      },
      play: {
        ...DEFAULT_REALTIME_STATE.play,
        banList: [null, null],
      },
    },
  })

  // Mock update function
  const onUpdate = (nextRoom: RoomData) => {
    console.log('[RealtimeView] onUpdate:', nextRoom.state.realtime.phase)
    setRoom(nextRoom)
  }

  return (
    <Provider>
      <div className="w-full h-screen bg-[#0c1119] text-white overflow-hidden">
        {/* Test as Role B to confirm Boss selection */}
        <ParticipantPhase role="B" room={room} onUpdate={onUpdate} />
      </div>
    </Provider>
  )
}

export default RealtimeView
