import { DEFAULT_REALTIME_STATE } from '@zzz-picker/constant'
import Provider from '@zzz-picker/provider/store'
import { useState } from 'react'
import type { RoomData } from '~/components/Phase'
import ParticipantBossSelect from '~/components/Phase/Participant/Boss'

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
        phase: 'BOSS_SELECT',
      },
    },
  })

  // Mock update function
  const onUpdate = (nextRoom: RoomData) => {
    console.log('[RealtimeView] onUpdate:', nextRoom)
    setRoom(nextRoom)
  }

  return (
    <Provider>
      <div className="w-full h-screen bg-[#0c1119] text-white overflow-hidden">
        {/* Changed to B Side View to verify player interaction logic */}
        <ParticipantBossSelect role="B" room={room} onUpdate={onUpdate} />
      </div>
    </Provider>
  )
}

export default RealtimeView
