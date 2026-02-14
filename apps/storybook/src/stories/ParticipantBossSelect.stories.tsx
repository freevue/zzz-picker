// 상대 경로를 사용하여 Alias 문제 우회
import ParticipantBossSelect from '../../../../apps/www/components/Phase/Participant/Boss'
import { ROOM_PHASE, type RoomData } from '../../../../apps/www/components/Phase/index'
import { MockSocketProvider, MockStoreProvider, LayoutDecorator } from '../decorators/MockProviders'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ParticipantBossSelect> = {
  title: 'Participant/BossSelect',
  component: ParticipantBossSelect,
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <MockSocketProvider>
          <Story />
        </MockSocketProvider>
      </MockStoreProvider>
    ),
    LayoutDecorator,
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    role: {
      control: 'radio',
      options: ['A', 'B'],
      description: '플레이어 역할 (A: 관전, B: 선택)',
    },
    // @ts-ignore
    selectedBossId: {
      control: { type: 'select' },
      options: [null, 1, 2, 3], // Mock Data ID 기준 (null: 미선택)
      description: '선택된 보스 ID (Player B일 때만 유효)',
    },
  },
}

export default meta
type Story = StoryObj<typeof ParticipantBossSelect>

const MOCK_ROOM_DATA: any = {
  roomId: 'test-room',
  state: {
    realtime: {
      phase: 'BOSS_SELECT',
      bossCandidates: null,
    },
    play: {
      common: {
        boss: null,
      },
    },
  },
}

export const Default: Story = {
  args: {
    role: 'B',
    room: MOCK_ROOM_DATA, // 초기값, render에서 덮어씌움
    onUpdate: (nextRoom) => console.log('[Story] onUpdate:', nextRoom),
  },
  render: (args, { loaded }) => {
    // Controls(args)를 기반으로 room 데이터 동적 생성
    const { role, selectedBossId } = args as any

    const dynamicRoom: RoomData = {
      ...MOCK_ROOM_DATA,
      state: {
        ...MOCK_ROOM_DATA.state,
        realtime: {
          ...MOCK_ROOM_DATA.state.realtime,
          // role이 B이고 selectedBossId가 있으면 선택 상태 반영
          bossCandidates: role === 'B' && selectedBossId ? Number(selectedBossId) : null,
        },
      },
    }

    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        {/* 모바일 뷰포트 시뮬레이션 (max-w-md 등) */}
        <div className="w-full max-w-md h-full bg-[#1a202c] relative shadow-2xl overflow-hidden">
          <ParticipantBossSelect {...args} room={dynamicRoom} />
        </div>
      </div>
    )
  },
}
