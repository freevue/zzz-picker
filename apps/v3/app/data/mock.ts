import type { Agent, Boss, Engine } from '@zzz-picker/constant'

/**
 * V3 샌드박스 전용 mock 데이터.
 * 운영 DB(Supabase)에 의존하지 않고 화면을 검증하기 위한 임시 로스터입니다.
 * 추후 Supabase Realtime 연동 시 이 모듈을 실제 fetch 계층으로 교체합니다.
 */

const IMG = 'https://images.zzz.freevue.dev/images/agents/156728/fde380b0-338d-4842-84e4-8527d2481c88.png'

// AgentGrid(zpds)의 필터 enum 과 호환되는 속성/역할 정의
export type GridAttribute = 'Fire' | 'Electric' | 'Ice' | 'Physical' | 'Ether'
export type GridSpecialty = 'Dps' | 'Stun' | 'Support' | 'Anomaly' | 'Defense'

export type GridAgent = {
  id: number
  nameKo: string
  attribute: GridAttribute
  specialty: GridSpecialty
}

type Seed = {
  id: number
  nameKo: string
  rarity: 'S' | 'A'
  color: string
  attribute: GridAttribute
  specialty: GridSpecialty
}

const SEEDS: Seed[] = [
  { id: 1001, nameKo: '엘렌', rarity: 'S', color: '#3b82f6', attribute: 'Ice', specialty: 'Dps' },
  { id: 1002, nameKo: '라이카', rarity: 'S', color: '#ef4444', attribute: 'Physical', specialty: 'Stun' },
  { id: 1003, nameKo: '칠소야', rarity: 'S', color: '#f59e0b', attribute: 'Ether', specialty: 'Anomaly' },
  { id: 1004, nameKo: '잔 이', rarity: 'S', color: '#8b5cf6', attribute: 'Electric', specialty: 'Stun' },
  { id: 1005, nameKo: '11호', rarity: 'S', color: '#dc2626', attribute: 'Fire', specialty: 'Dps' },
  { id: 1006, nameKo: '그레이스', rarity: 'S', color: '#10b981', attribute: 'Electric', specialty: 'Anomaly' },
  { id: 1007, nameKo: '리나', rarity: 'S', color: '#06b6d4', attribute: 'Electric', specialty: 'Support' },
  { id: 1008, nameKo: '카에데하라', rarity: 'S', color: '#a3e635', attribute: 'Physical', specialty: 'Dps' },
  { id: 2001, nameKo: '니콜', rarity: 'A', color: '#a855f7', attribute: 'Ether', specialty: 'Support' },
  { id: 2002, nameKo: '안비', rarity: 'A', color: '#e11d48', attribute: 'Electric', specialty: 'Dps' },
  { id: 2003, nameKo: '빌리', rarity: 'A', color: '#0ea5e9', attribute: 'Physical', specialty: 'Dps' },
  { id: 2004, nameKo: '코린', rarity: 'A', color: '#84cc16', attribute: 'Physical', specialty: 'Dps' },
  { id: 2005, nameKo: '벤', rarity: 'A', color: '#f97316', attribute: 'Fire', specialty: 'Defense' },
  { id: 2006, nameKo: '안톤', rarity: 'A', color: '#eab308', attribute: 'Electric', specialty: 'Dps' },
  { id: 2007, nameKo: '소우카쿠', rarity: 'A', color: '#22d3ee', attribute: 'Ice', specialty: 'Support' },
  { id: 2008, nameKo: '루시', rarity: 'A', color: '#fb7185', attribute: 'Fire', specialty: 'Support' },
]

const attrKo: Record<GridAttribute, string> = {
  Fire: '화염',
  Electric: '전기',
  Ice: '얼음',
  Physical: '물리',
  Ether: '에테르',
}
const specKo: Record<GridSpecialty, string> = {
  Dps: '강공',
  Stun: '격파',
  Support: '지원',
  Anomaly: '이상',
  Defense: '방어',
}

const toAgent = (s: Seed): Agent => ({
  id: s.id,
  rarity: s.rarity,
  isTeaser: false,
  isPickup: false,
  isAllow: true,
  color: s.color,
  nameKo: s.nameKo,
  fullNameKo: s.nameKo,
  banner: { url: IMG, description: s.nameKo, sources: { name: 'mock', url: IMG } },
  profile: { url: IMG, description: s.nameKo, sources: { name: 'mock', url: IMG } },
  specialty: { id: 1, nameKo: specKo[s.specialty] },
  attributes: { id: 1, nameKo: attrKo[s.attribute] },
  engine: [],
})

export const MOCK_AGENTS: Agent[] = SEEDS.map(toAgent)

export const MOCK_AGENT_MAP = new Map<number, Agent>(MOCK_AGENTS.map((a) => [a.id, a]))

export const MOCK_GRID_AGENTS: GridAgent[] = SEEDS.map((s) => ({
  id: s.id,
  nameKo: s.nameKo,
  attribute: s.attribute,
  specialty: s.specialty,
}))

export const MOCK_ENGINES: Engine[] = []
export const MOCK_ENGINE_MAP = new Map<number, Engine>()

export const MOCK_BOSS: Boss[] = [
  { id: 9001, nameKo: '뉴 아이 부대', hp: [1_000_000], resistance: [], weakness: [] },
  { id: 9002, nameKo: '말살 부대 "데드엔드 부처"', hp: [1_200_000], resistance: [], weakness: [] },
  { id: 9003, nameKo: '폭주 브링거', hp: [1_500_000], resistance: [], weakness: [] },
]
export const MOCK_BOSS_MAP = new Map<number, Boss>(MOCK_BOSS.map((b) => [b.id, b]))

/** 등급 기반 mock 코스트 (실제 코스트 스키마 도입 전 임시값) */
export const getMockAgentCost = (id: number): number => {
  const agent = MOCK_AGENT_MAP.get(id)
  if (!agent) return 0
  return agent.rarity === 'S' ? 8 : 4
}
