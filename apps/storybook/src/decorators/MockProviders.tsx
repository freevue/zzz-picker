import { MOCK_BOSS_DATA } from '../mocks/bossData'
import type { Boss, DeadlyAssault } from '@zzz-picker/constant'
import { SocketContext, StoreContext } from '@zzz-picker/provider'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'

// Mock Socket Provider
export const MockSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockContext = {
    socket: null,
    isConnected: true,
    send: (event: string, data: any) => {
      console.log(`[MockSocket] Event: ${event}`, data)
    },
    on: () => {},
    off: () => {},
  } as any

  return <SocketContext.Provider value={mockContext}>{children}</SocketContext.Provider>
}

// Mock Store Provider
export const MockStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bossMap = useMemo(() => {
    const map = new Map<number, Boss>()
    MOCK_BOSS_DATA.forEach((boss) => map.set(boss.id, boss as any))
    return map
  }, [])

  const mockAgents = useMemo(() => {
    return new Map<number, any>([
      [156728, {
        id: 156728,
        rarity: 'S',
        isTeaser: false,
        isPickup: true,
        isAllow: true,
        color: '#ff4400',
        nameKo: '주연',
        fullNameKo: '주연',
        profile: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', description: '', sources: { name: '', url: '' } },
        attributes: { id: 1, nameKo: 'Ether' },
        specialty: { id: 1, nameKo: 'Dps' }
      }],
      [113671, {
        id: 113671,
        rarity: 'S',
        isTeaser: false,
        isPickup: false,
        isAllow: true,
        color: '#00aa66',
        nameKo: '네코마타',
        fullNameKo: '네코마타',
        profile: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', description: '', sources: { name: '', url: '' } },
        attributes: { id: 2, nameKo: 'Physical' },
        specialty: { id: 1, nameKo: 'Dps' }
      }],
      [104612, {
        id: 104612,
        rarity: 'A',
        isTeaser: false,
        isPickup: false,
        isAllow: true,
        color: '#0088ff',
        nameKo: '소우카쿠',
        fullNameKo: '소우카쿠',
        profile: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', description: '', sources: { name: '', url: '' } },
        attributes: { id: 3, nameKo: 'Ice' },
        specialty: { id: 2, nameKo: 'Support' }
      }],
      [138652, {
        id: 138652,
        rarity: 'S',
        isTeaser: false,
        isPickup: false,
        isAllow: true,
        color: '#ffff00',
        nameKo: '그레이스',
        fullNameKo: '그레이스',
        profile: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', description: '', sources: { name: '', url: '' } },
        attributes: { id: 4, nameKo: 'Electric' },
        specialty: { id: 3, nameKo: 'Anomaly' }
      }]
    ])
  }, [])

  const mockEngines = useMemo(() => {
    return new Map<number, any>([
      [1, {
        id: 1,
        isPickup: true,
        nameKo: '마법의 녹화기',
        exclusiveAgentId: 156728,
        rank: 'S',
        imageUrl: '',
        iconUrl: '',
        profile: { url: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=150' }
      }]
    ])
  }, [])

  // 랜덤하게 3개의 보스 선택하여 DeadlyAssault 구성
  const deadlyAssaultList = useMemo(() => {
    // 배열 복사 후 섞기
    const shuffled = [...MOCK_BOSS_DATA].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)

    // DeadlyAssault 타입에 맞게 데이터 구성 (필수 필드만 채움)
    const mockAssault: any = {
      id: 1,
      nameKo: 'Mock Assault',
      open: dayjs(), // 현재 시간
      boss1: selected[0] || MOCK_BOSS_DATA[0],
      boss2: selected[1] || MOCK_BOSS_DATA[1],
      boss3: selected[2] || MOCK_BOSS_DATA[2],
    }

    return [mockAssault]
  }, [])

  const mockContext = {
    agents: mockAgents,
    boss: bossMap,
    engines: mockEngines,
    deadlyAssaultList: deadlyAssaultList,
    save: async () => {},
    authCheck: async () => false,
    getHistory: async () => [],
    getAuthKey: async () => [],
    getAuthKeyList: async () => [],
  } as any

  return <StoreContext.Provider value={mockContext}>{children}</StoreContext.Provider>
}

// Layout Decorator
export const LayoutDecorator = (Story: React.ComponentType) => (
  <div className="w-full h-screen bg-[var(--color-base)] text-[var(--color-ink)] overflow-y-auto relative p-4 transition-colors duration-200">
    <Story />
  </div>
)
