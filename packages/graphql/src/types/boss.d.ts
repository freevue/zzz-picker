import type { GQL_Edges, GQL_Node, GQL_Attribute } from '.'

export type GQL_Boss<T> = {
  id: number
  nameKo: string
  hp: Array<number>
  resistance: T
  weakness: T
}
export type GQL_BossList = {
  bossCollection: GQL_Edges<GQL_Node<GQL_Boss<GQL_Edges<GQL_Node<GQL_Attribute>>>>>
}
