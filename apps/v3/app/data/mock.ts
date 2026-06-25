/**
 * V3 샌드박스 전용 mock 데이터.
 * 운영 DB(Supabase) 없이 화면을 검증하기 위한 임시 로스터입니다.
 * 추후 Supabase / 신규 DB 연동 시 이 모듈을 실제 fetch 계층으로 교체합니다.
 */

export type GridAttribute = 'Fire' | 'Electric' | 'Ice' | 'Physical' | 'Ether'
export type GridSpecialty = 'Dps' | 'Stun' | 'Support' | 'Anomaly' | 'Defense'

export type MockAgent = {
  id: number
  nameKo: string
  rarity: 'S' | 'A'
  color: string
  attribute: GridAttribute
  specialty: GridSpecialty
  isPickup: boolean
  isAllow: boolean // 보호 캐릭터(밴 불가)
  isTeaser: boolean
}

// 포지션: 딜러(강공/이상/명파) · 서포터(지원/격파/방어)
const DEALER: GridSpecialty[] = ['Dps', 'Anomaly']
export const isDealer = (s: GridSpecialty) => DEALER.includes(s)

const A_ROW = (
  id: number,
  nameKo: string,
  rarity: 'S' | 'A',
  color: string,
  attribute: GridAttribute,
  specialty: GridSpecialty,
  isPickup: boolean,
  isAllow = false
): MockAgent => ({ id, nameKo, rarity, color, attribute, specialty, isPickup, isAllow, isTeaser: false })

export const MOCK_AGENTS: MockAgent[] = [
  // S 픽업 (밴/코스트 대상)
  A_ROW(1001, '엘렌', 'S', '#8fb4f2', 'Ice', 'Dps', true),
  A_ROW(1002, '라이카', 'S', '#f2a6a6', 'Physical', 'Stun', true),
  A_ROW(1003, '칠소야', 'S', '#f5cf9b', 'Ether', 'Anomaly', true),
  A_ROW(1004, '잔 이', 'S', '#bfa6f2', 'Electric', 'Stun', true),
  A_ROW(1005, '11호', 'S', '#f2b0a0', 'Fire', 'Dps', true),
  A_ROW(1006, '리나', 'S', '#a6d8f2', 'Electric', 'Support', true),
  A_ROW(1007, '버니스', 'S', '#f7b8a0', 'Fire', 'Anomaly', true),
  A_ROW(1008, '카링', 'S', '#9fdcc0', 'Ether', 'Stun', true),
  // S 상시/보호 (밴 불가, 코스트 0)
  A_ROW(1101, '그레이스', 'S', '#a9e0c9', 'Electric', 'Anomaly', false, true),
  A_ROW(1102, '주연', 'S', '#c9bdf5', 'Ether', 'Support', false, true),
  // A 상시 (밴 불가, 코스트 0)
  A_ROW(2001, '니콜', 'A', '#c3b3f0', 'Ether', 'Support', false),
  A_ROW(2002, '안비', 'A', '#f2acbd', 'Electric', 'Dps', false),
  A_ROW(2003, '빌리', 'A', '#a9cef2', 'Physical', 'Dps', false),
  A_ROW(2004, '코린', 'A', '#bfe3a8', 'Physical', 'Dps', false),
  A_ROW(2005, '벤', 'A', '#f5c79b', 'Fire', 'Defense', false),
  A_ROW(2006, '소우카쿠', 'A', '#a6e0e6', 'Ice', 'Support', false),
]

export const MOCK_AGENT_MAP = new Map<number, MockAgent>(MOCK_AGENTS.map((a) => [a.id, a]))

export const MOCK_BOSS: { id: number; nameKo: string }[] = [
  { id: 9001, nameKo: '뉴 아이 부대' },
  { id: 9002, nameKo: '데드엔드 부처' },
  { id: 9003, nameKo: '폭주 브링거' },
]
export const MOCK_BOSS_MAP = new Map<number, { id: number; nameKo: string }>(MOCK_BOSS.map((b) => [b.id, b]))

/** 코스트(자동): 픽업 S만 1 (돌파/무기 미반영 mock) */
export const getAgentCost = (id: number): number => {
  const a = MOCK_AGENT_MAP.get(id)
  return a && a.isPickup && a.rarity === 'S' ? 1 : 0
}

/** 밴 가능 조건: 픽업 S, 보호/티저 제외 */
export const isBanEligible = (id: number): boolean => {
  const a = MOCK_AGENT_MAP.get(id)
  return !!a && a.isPickup && a.rarity === 'S' && !a.isAllow && !a.isTeaser
}
