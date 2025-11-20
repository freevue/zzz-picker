type Boss = {
  id: number
  nameKo: string
}
type Attribute = {
  id: number
  nameKo: string
}

export type DeadlyAssault = {
  id: number
  version: number
  open: string
  boss1: Boss
  boss2: Boss
  boss3: Boss
}
export type Boss = {
  id: number
  nameKo: string
  hp: Array<number>
  resistance: Array<Attribute>
  weakness: Array<Attribute>
}