import type { GQL_Edges, GQL_Node, GQL_Attribute } from '.'

export type GQL_Boss = {
  id: number
  nameKo: string
  hp: Array<number>
  resistance: GQL_Edges<GQL_Node<GQL_Attribute>>
  weakness: GQL_Edges<GQL_Node<GQL_Attribute>>
}
export type GQL_BossList = {
  bossCollection: GQL_Edges<GQL_Node<GQL_Boss>>
}
